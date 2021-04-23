import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { validateOrReject } from 'class-validator';
import _ from 'lodash';

import { plainToClass } from 'class-transformer';
import pdf from 'pdf-parse';
import { createHash } from 'crypto';
import { EcmrRequestDto } from './dto/ecmr-request.dto';

import { PinDto } from './dto/pin.dto';

import { getRestConfig } from '../config/restConfig';
import { EcmrDto } from './dto/ecmr.dto';
import { EcmrRestException } from './exception/ecmr.rest.exception';
import { EcmrParsingException } from './exception/ecmr.parsing.exception';
import { EcmrUnknownPidException } from './exception/ecmrUnknownPidException';

const REST_API = JSON.parse(process.env.REST_CONFIGURATION || '{}');
const useEnvConfiguration: boolean = Object.keys(REST_API).length > 0;

/** The EcmrService class implements methods for requesting eCMR documents from the corresponding logistic companies, parsing eCMR PDFs and calulating the eCMR hashes. */
@Injectable()
export class EcmrService {
  private readonly logger = new Logger(EcmrService.name);

  private readonly pinStr = 'PIN:';

  private readonly cmrStr = 'ecmr_';

  private readonly pinLength: number = 5;

  private readonly cmrLength: number = 20;

  private readonly restTimeout: number = 5000;

  /**
   * Requests the ecmr document from the corresponding rest endpoint
   * @param {string} eid The Id of the requested ecmr document
   * @param {string} pinCode The pin/secret that is used to request the ecmr document
   * @throws {EcmrRestException} Throws an EcmrRestException with the corresponding status code when the rest api that is called returns with 401 or 403.
   * @throws {Error} Throws a generic error if something else goes wrong (e.g. when there is no endpoint for the requested id or when something else goes wrong within the rest call).
   * @return {EcmrDto} The requested ecmr document
   */
  async getEcmr(eid: string, pinCode: string): Promise<EcmrDto> {
    this.logger.log(`getEcmr(eid: ${eid}, pinCode.length: ${pinCode.length})`);
    const pinBody = new PinDto(pinCode);
    const restEndpoint = await this.getRestEndpoint(eid);
    // might throw generic error when there is no corresponding rest endpoint reachable
    try {
      const axiosInstance = axios.create({ baseURL: restEndpoint, timeout: this.restTimeout });
      this.logger.log(`getEcmr(id[${eid}]) - fetch data from ecmr rest endpoint...`);
      const response = await axiosInstance.post(eid.toString(), pinBody);
      const ecmr: EcmrDto = plainToClass(EcmrDto, await response.data);
      await validateOrReject(ecmr); // if validation fails, throw generic error
      this.logger.log(`getEcmr received valid ecmr from rest endpoint (eid: ${eid})`);
      return ecmr;
    } catch (err) {
      if (err.response) {
        this.logger.error(`Received ${err.response.status} statuscode when requesting the eCMR (eid: ${eid})`);
        if (err.response.status === 401) {
          // e.g. wrong pin, ecmr doc not found
          throw new EcmrRestException('Error requesting the eCMR', err.response.status);
        } else if (err.response.status === 403) {
          // e.g. rest api locked or ratelimited
          throw new EcmrRestException('Error requesting the eCMR', err.response.status);
        }
      }
      // something else went wrong --> throw generic error
      this.logger.error(`Generic error requesting the eCMR (id[${eid}]: ${JSON.stringify(err)})!`);
      throw Error('Error requesting the eCMR!');
    }
  }

  /**
   * Returns the corresponding rest endpoint for a ecmr document.
   * The first three digis of the eid are used to identify the responsible company and/or rest endpoint.
   * @param {number} eid The Id of the ecmr document that is requested.
   * @throws {Error} Throws an error when the endpoint for the requested id cannot be determined.
   * @return {string} Rest endpoint that corresponds to the ecmr document.
   */
  getRestEndpoint(eid: string): string {
    this.logger.log(`getRestEndpoint(eid: ${eid})`);
    const pid = eid.split('-')[0]; // pid (=first digits before "-") identify the correct rest endpoint
    let endpoint = getRestConfig(pid);
    if (useEnvConfiguration) {
      endpoint = REST_API[pid];
    }

    if (_.isEmpty(endpoint)) {
      throw new EcmrUnknownPidException('Unknown Provider ID', 426);
    }
    this.logger.log(`getRestEndpoint found endpoint: ${endpoint})`);
    return endpoint;
  }

  /**
   * Parses the supplied file and requests the respective eCMR document from the corresponding rest endpoint.
   * @param {EcmrFileRequestDto} ecmrFile The eCMR pdf file to parse.
   * @throws {Error} Throws a generic error if something goes wrong.
   * @return {EcmrDto} The requested ecmr document
   */

  async getEcmrRequestByPdf(ecmrFile: Buffer): Promise<EcmrRequestDto> {
    this.logger.log(`getEcmrRequestByPdf(ecmrFile)`);
    return this.parsePdf(ecmrFile);
  }

  /**
   * Parses an eCMR file for it's id and pin code.
   * @param {Buffer} ecmrFile A file buffer containing an eCMR pdf.
   * @throws {Error} Throws an error when the file is not a valid pdf or the eCMR id and pin cannot be found.
   * @return {EcmrRequestDto} The id and pin code for an eCMR request.
   */
  async parsePdf(ecmrFile: Buffer): Promise<EcmrRequestDto> {
    this.logger.log(`getEcmrRequestByPdf(ecmrFile)`);
    try {
      const ecmrPdf = await pdf(ecmrFile);
      // get pdf content without whitespaces to make parsing more robust
      const content = ecmrPdf.text.replace(/\s/g, '');
      const pinIndex = content.indexOf(this.pinStr);
      if (pinIndex === -1) {
        this.logger.error('Error parsing PIN Code');
        throw new EcmrParsingException('Error parsing PIN Code');
      }
      const pin = content.substring(pinIndex + this.pinStr.length, pinIndex + this.pinStr.length + this.pinLength);

      const cmrIndex = content.indexOf(this.cmrStr);
      if (cmrIndex === -1) {
        this.logger.error('Error parsing ECMR ID!');
        throw new EcmrParsingException('Error parsing ECMR ID!');
      }
      const cmr = content.substring(cmrIndex + this.cmrStr.length, cmrIndex + this.cmrStr.length + this.cmrLength);
      this.logger.log(`getEcmrRequestByPdf() found ECMR: ${cmr}, pinCode.length: ${pin.length}`);
      const ret = new EcmrRequestDto(cmr, pin);
      return ret;
    } catch (err) {
      throw new EcmrParsingException(err.message);
    }
  }

  /**
   * Returns the hash value of an EcmrDto.
   * @param {EcmrDto} ecmrDto The eCMR to hash.
   * @return {string} Calculated hash of given eCMR.
   */
  calculateEcmrHash(ecmrDto: EcmrDto): string {
    this.logger.log(`calculateEcmrHash(eid: ${ecmrDto.eid})`);
    const hash = createHash('sha256').update(JSON.stringify(ecmrDto)).digest('hex');
    this.logger.log(`calculatedEcmrHash: 0x${hash}`);
    return `0x${hash}`;
  }

  /**
   * Returns the hash value of a pdf file.
   * @param {Buffer} ecmr The eCMR pdf file to hash.
   * @return {string} Calculated hash of given eCMR.
   */
  calculatePdfHash(ecmr: Buffer): string {
    this.logger.log(`calculatePdfHash(ecmrFile)`);
    const hash = createHash('sha256').update(ecmr).digest('hex');
    this.logger.log(`calculatedPdfHash: 0x${hash}`);
    return `0x${hash}`;
  }
}
