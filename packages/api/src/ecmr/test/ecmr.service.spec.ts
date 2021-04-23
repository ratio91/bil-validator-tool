/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import fs from 'fs';

import { EcmrService } from '../ecmr.service';
import { EcmrDto } from '../dto/ecmr.dto';
import { exampleJson } from './resources/exampleJson';

import mockAxios from './__mocks__/axios';
import { EcmrRestException } from '../exception/ecmr.rest.exception';
import { EcmrParsingException } from '../exception/ecmr.parsing.exception';
import { EcmrRequestDto } from '../dto/ecmr-request.dto';
import { EcmrEventData } from '../../ethereum/dto/ecmr-event-data';

describe('EcmrService', () => {
  let ecmrService: EcmrService;

  const sampleId = '100243253291859';
  const samplePin = '12345';
  const sampleEcmrRequest = new EcmrRequestDto(sampleId, samplePin);
  const sampleEcmr: EcmrDto = plainToClass(EcmrDto, exampleJson);
  const sampleEcmrEventData = new EcmrEventData(
    '0x69540db825fa2a0742c747186ccf835bc4955318e0aca43b00d48bc11ddbe681',
    '0x41f594d2e806c266f74e12012c966f291ff635cc8625130dc93b6de27d41a2ed',
  );

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EcmrService],
    }).compile();

    ecmrService = module.get<EcmrService>(EcmrService);

    jest.spyOn(ecmrService, 'getRestEndpoint').mockImplementation(() => {
      return 'restEndpoint';
    });
  });

  describe('getEcmr', () => {
    it('should return a valid ecmr', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        return Promise.resolve({ data: exampleJson });
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).resolves.toEqual(sampleEcmr);
    });

    it('should return a generic error since ecmr document validation is rejected', async () => {
      const exampleJsonErr = JSON.parse(JSON.stringify(exampleJson));
      exampleJsonErr._id = null;
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        return Promise.resolve({ data: exampleJsonErr });
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(Error);
    });

    it('should return a ecmrRestException when ecmr rest endpoints returns 401', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 401 } };
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(EcmrRestException);
    });

    it('should return a ecmrRestException when ecmr rest endpoints returns 403', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 403 } };
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(EcmrRestException);
    });

    it('should return a generic error when ecmr restpoint returns bad status message', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 404 } };
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(Error);
    });

    it('should return a generic error when post call fails', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw Error();
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(Error);
    });

    it('should return a generic error when rest endpoint cannot be determined', async () => {
      jest.spyOn(ecmrService, 'getRestEndpoint').mockImplementation(() => {
        throw new Error();
      });

      await expect(ecmrService.getEcmr(sampleId, samplePin)).rejects.toThrow(Error);
    });
  });

  describe('parsePdf', () => {
    it('should return proper ecmr id and pin code', async () => {
      const sampleRequest: EcmrRequestDto = { id: sampleId, pin: samplePin } as EcmrRequestDto;
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');

      await expect(ecmrService.parsePdf(file)).resolves.toEqual(sampleRequest);
    });

    it('should throw error if file buffer is empty', async () => {
      const file = Buffer.alloc(0);

      await expect(ecmrService.parsePdf(file)).rejects.toThrow(EcmrParsingException);
    });

    it('should throw error if eCMR id cannot be found', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/invalidIdEcmr.pdf');

      await expect(ecmrService.parsePdf(file)).rejects.toThrow(EcmrParsingException);
    });

    it('should throw error if pin code cannot be found', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/invalidPinEcmr.pdf');

      await expect(ecmrService.parsePdf(file)).rejects.toThrow(EcmrParsingException);
    });

    it('should throw error if file is invalid', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/invalidFile.png');

      await expect(ecmrService.parsePdf(file)).rejects.toThrow(EcmrParsingException);
    });
  });

  describe('getEcmrRequestByPdf', () => {
    it('should return a valid ecmr', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');

      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });

      await expect(ecmrService.getEcmrRequestByPdf(file)).resolves.toEqual(sampleEcmrRequest);
    });

    it('should throw error if file buffer is empty', async () => {
      const file = Buffer.alloc(0);

      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });

      await expect(ecmrService.getEcmrRequestByPdf(file)).rejects.toThrow(EcmrParsingException);
    });

    it('should throw error if file is invalid', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/invalidFile.png');

      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });

      await expect(ecmrService.getEcmrRequestByPdf(file)).rejects.toThrow(EcmrParsingException);
    });
  });
  describe('calculateEcmrHash', () => {
    it('should return a hash value', async () => {
      expect(ecmrService.calculateEcmrHash(sampleEcmr)).toBe(sampleEcmrEventData.ecmrHash);
    });

    it('hash from altered json should not be equal to hash from Ecmr object', async () => {
      jest.spyOn(ecmrService, 'calculateEcmrHash').mockImplementation(() => {
        return 'hash';
      });

      expect(ecmrService.calculateEcmrHash(sampleEcmr)).not.toBe(sampleEcmrEventData.ecmrHash);
    });
  });

  describe('calculatePdfHash', () => {
    it('should return a hash value', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');

      expect(ecmrService.calculatePdfHash(file)).toBe(sampleEcmrEventData.pdfHash);
    });

    it('hash from invalid file should not be equal to hash from valid eCMR', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/invalidPinEcmr.pdf');

      expect(ecmrService.calculatePdfHash(file)).not.toBe(sampleEcmrEventData.pdfHash);
    });
  });
});
