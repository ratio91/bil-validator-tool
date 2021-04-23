import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EcmrService } from './ecmr.service';
import { EcmrRequestDto } from './dto/ecmr-request.dto';
import { EcmrRestException } from './exception/ecmr.rest.exception';
import { EcmrFileRequestDto } from './dto/ecmr-file-request.dto';
import { EcmrParsingException } from './exception/ecmr.parsing.exception';
import { EthereumService } from '../ethereum/ethereum.service';
import { EcmrDto } from './dto/ecmr.dto';
import { EcmrHashMismatchException } from './exception/ecmrHashMismatchException';
import { EcmrUnknownPidException } from './exception/ecmrUnknownPidException';

/** The EcmrController class implements controller endpoints that offer functionality to parse/retrieve eCMR documents and confirm their legitimacy. */
// @ApiBearerAuth()
// @ApiTags('ecmr')
@Controller('ecmr')
export class EcmrController {
  private readonly logger = new Logger(EcmrController.name);

  constructor(private readonly ecmrService: EcmrService, private readonly ethereumService: EthereumService) {}

  @Post()
  // @ApiResponse({
  //   status: 201,
  //   description: 'The found ecmr document with its corresponding hash value',
  //   type: EcmrDto,
  // })
  // @ApiResponse({ status: 400, description: 'Bad request.' }) // when ecmrRequestDto cannot be validated
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({ status: 404, description: 'Not Found.' })
  // @ApiResponse({ status: 422, description: 'Unprocessable Entity' }) // hashes are not equal
  // @ApiResponse({ status: 426, description: 'Unknown CompanyID' })
  @UsePipes(new ValidationPipe({ transform: true })) // automatically validates ecmrRequestDto
  async getEcmr(@Body() ecmrRequestDto: EcmrRequestDto): Promise<EcmrDto> {
    this.logger.log(`getEcmr(ecmrRequestDto: id[${ecmrRequestDto.id}])`);
    try {
      const ecmrDtoPromise = await this.ecmrService.getEcmr(ecmrRequestDto.id, ecmrRequestDto.pin);
      const ecmrHash = this.ecmrService.calculateEcmrHash(ecmrDtoPromise); // calculate eCMR hash

      const ethEventDataPromise = await this.ethereumService.getEcmrEventData(ecmrRequestDto.id, ecmrHash);
      if (ecmrHash === undefined || ecmrHash !== ethEventDataPromise.ecmrHash) {
        throw new EcmrHashMismatchException('Invalid eCMR hash!', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return ecmrDtoPromise;
    } catch (err) {
      if (
        err instanceof EcmrRestException ||
        err instanceof EcmrHashMismatchException ||
        err instanceof EcmrUnknownPidException
      ) {
        throw new HttpException(err.getResponse(), err.getStatus());
      } else {
        // throw generic error
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post('upload')
  // @ApiResponse({
  //   status: 201,
  //   description: 'The found ecmr document',
  //   type: EcmrDto,
  // })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({ status: 404, description: 'Not Found.' })
  // @ApiResponse({ status: 422, description: 'Unprocessable Entity' }) // hashes are not equal
  // @ApiResponse({ status: 426, description: 'Unknown CompanyID' }) // hashes are not equal
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @UseInterceptors(FileInterceptor('file'))
  async getEcmrByPdf(@UploadedFile() ecmrFile: EcmrFileRequestDto): Promise<boolean> {
    this.logger.log('getEcmrByPdf(ecmrFile)');
    try {
      // parse ecmr pdf
      const ecmrRequestDto = await this.ecmrService.getEcmrRequestByPdf(ecmrFile.buffer);

      const ecmrFileHash = this.ecmrService.calculatePdfHash(ecmrFile.buffer); // calculate PDF hash
      // const ecmrDtoPromise = await this.ecmrService.getEcmr(ecmrRequestDto.id, ecmrRequestDto.pin);
      // const ecmrHash = this.ecmrService.calculateEcmrHash(ecmrDtoPromise); // calculate eCMR hash

      const ethEventDataPromise = this.ethereumService.getEcmrEventData(ecmrRequestDto.id, 'ecmrHash', ecmrFileHash);
      const ethEventData = await ethEventDataPromise;

      if (ecmrFileHash !== ethEventData.pdfHash) {
        throw new EcmrHashMismatchException('Invalid eCMR PDF hash!', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return true;
    } catch (err) {
      if (
        err instanceof EcmrRestException ||
        err instanceof EcmrHashMismatchException ||
        err instanceof EcmrUnknownPidException
      ) {
        throw new HttpException(err.getResponse(), err.getStatus());
      } else if (err instanceof EcmrParsingException) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      } else {
        // throw generic error
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
