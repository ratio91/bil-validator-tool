import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import fs from 'fs';

import { EcmrService } from '../ecmr.service';
import { EcmrController } from '../ecmr.controller';
import { EcmrDto } from '../dto/ecmr.dto';
import { EcmrRequestDto } from '../dto/ecmr-request.dto';
import { exampleJson } from './resources/exampleJson';
import { EcmrRestException } from '../exception/ecmr.rest.exception';
import { EcmrParsingException } from '../exception/ecmr.parsing.exception';
import { EcmrFileRequestDto } from '../dto/ecmr-file-request.dto';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EcmrEventData } from '../../ethereum/dto/ecmr-event-data';

describe('EcmrController', () => {
  let ecmrController: EcmrController;
  let ecmrService: EcmrService;
  let ethereumService: EthereumService;

  const sampleId = '100243253291859';
  const samplePin = '12345';
  const sampleRequest: EcmrRequestDto = { id: sampleId, pin: samplePin } as EcmrRequestDto;
  const sampleEcmr: EcmrDto = (exampleJson as unknown) as EcmrDto;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EcmrController],
      providers: [EcmrService, EthereumService],
    }).compile();

    ecmrController = module.get<EcmrController>(EcmrController);
    ecmrService = module.get<EcmrService>(EcmrService);
    ethereumService = module.get<EthereumService>(EthereumService);
  });

  describe('getEcmr', () => {
    it('should return a valid ecmr', async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });
      expect(ecmrController.getEcmr(sampleRequest)).resolves.toEqual(sampleEcmr);
    });

    it('controller should throw an httpexception when service throws error', async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        throw new Error();
      });
      expect(ecmrController.getEcmr(sampleRequest)).rejects.toThrow(HttpException);
    });

    it('controller should give 404 when service throws generic error', async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        throw new Error();
      });

      await ecmrController.getEcmr(sampleRequest).catch((error) => {
        expect(error.status).toBe(404);
      });
    });

    it('controller should give 401 when service throws 401 error', async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        throw new EcmrRestException('Error requesting the eCMR', 401);
      });

      await ecmrController.getEcmr(sampleRequest).catch((error) => {
        expect(error.status).toBe(401);
      });
    });

    it('controller should give 403 when service throws 403 error', async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        throw new EcmrRestException('Error requesting the eCMR', 403);
      });

      await ecmrController.getEcmr(sampleRequest).catch((error) => {
        expect(error.status).toBe(403);
      });
    });

    it("controller should give 422 when hashes don't match", async () => {
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });
      jest.spyOn(ecmrService, 'calculateEcmrHash').mockImplementation(() => {
        return 'ecmr hash';
      });
      jest.spyOn(ethereumService, 'getEcmrEventData').mockImplementation(() => {
        return Promise.resolve({ ecmrHash: 'ethereum hash', pdfHash: 'ethereum hash' });
      });

      await ecmrController.getEcmr(sampleRequest).catch((error) => {
        expect(error.status).toBe(422);
      });
    });
  });

  describe('getEcmrByPdf', () => {
    it('should return a valid ecmr', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        return Promise.resolve(sampleRequest);
      });
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });
      expect(ecmrController.getEcmrByPdf(sampleFileRequest)).resolves.toBe(sampleEcmr);
    });

    it('controller should throw an httpexception when service throws error', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        throw new Error();
      });
      expect(ecmrController.getEcmrByPdf(sampleFileRequest)).rejects.toThrow(HttpException);
    });

    it('controller should give 404 when service throws generic error', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        throw new Error();
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(404);
      });
    });

    it('controller should give 401 when service throws 401 error', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        throw new EcmrRestException('Error requesting the eCMR', 401);
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(401);
      });
    });

    it('controller should give 403 when service throws 403 error', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        throw new EcmrRestException('Error requesting the eCMR', 403);
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(403);
      });
    });

    it('controller should give 400 when service throws PdfParsingException', async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        throw new EcmrParsingException();
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(400);
      });
    });

    it("controller should give 422 when eCMR hashes don't match", async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        return Promise.resolve(sampleRequest);
      });
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });
      jest.spyOn(ecmrService, 'calculatePdfHash').mockImplementation(() => {
        return 'ethereum hash';
      });
      jest.spyOn(ecmrService, 'calculateEcmrHash').mockImplementation(() => {
        return 'ecmr hash';
      });
      jest.spyOn(ethereumService, 'getEcmrEventData').mockImplementation(() => {
        return Promise.resolve(new EcmrEventData('ethereum hash', 'ethereum hash'));
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(422);
      });
    });

    it("controller should give 422 when pdf hashes don't match", async () => {
      const file = fs.readFileSync('src/ecmr/test/resources/validEcmr.pdf');
      const sampleFileRequest = {
        fieldname: 'file',
        originalname: 'validEcmr.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: file,
        size: 25719,
      } as EcmrFileRequestDto;

      jest.spyOn(ecmrService, 'getEcmrRequestByPdf').mockImplementation(() => {
        return Promise.resolve(sampleRequest);
      });
      jest.spyOn(ecmrService, 'getEcmr').mockImplementation(() => {
        return Promise.resolve(sampleEcmr);
      });
      jest.spyOn(ecmrService, 'calculatePdfHash').mockImplementation(() => {
        return 'ecmr hash';
      });
      jest.spyOn(ecmrService, 'calculateEcmrHash').mockImplementation(() => {
        return 'ethereum hash';
      });
      jest.spyOn(ethereumService, 'getEcmrEventData').mockImplementation(() => {
        return Promise.resolve(new EcmrEventData('ethereum hash', 'ethereum hash'));
      });

      await ecmrController.getEcmrByPdf(sampleFileRequest).catch((error) => {
        expect(error.status).toBe(422);
      });
    });
  });
});
