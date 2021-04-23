/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EcmrModule } from '../ecmr.module';
import { EcmrService } from '../ecmr.service';
import { exampleJson } from './resources/exampleJson';
import { EcmrRequestDto } from '../dto/ecmr-request.dto';
import { EcmrDto } from '../dto/ecmr.dto';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EcmrEventData } from '../../ethereum/dto/ecmr-event-data';

describe('Ecmr', () => {
  let app: INestApplication;

  const sampleId = '100243253291859';
  const samplePin = '12345';
  const sampleRequest = { id: sampleId, pin: samplePin } as EcmrRequestDto;
  const fileRequest = 'src/ecmr/test/resources/validEcmr.pdf';
  const sampleEcmr: EcmrDto = (exampleJson as unknown) as EcmrDto;
  const sampleEcmrEventData = new EcmrEventData(
    '0x69540db825fa2a0742c747186ccf835bc4955318e0aca43b00d48bc11ddbe681',
    '0x41f594d2e806c266f74e12012c966f291ff635cc8625130dc93b6de27d41a2ed',
  );

  const ecmrService = {
    getEcmr: () => sampleEcmr,
    getEcmrRequestByPdf: () => sampleRequest,
    calculateEcmrHash: () => sampleEcmrEventData.ecmrHash,
    calculatePdfHash: () => sampleEcmrEventData.pdfHash,
  };
  const ethereumService = { getEcmrEventData: () => sampleEcmrEventData };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EcmrModule],
    })
      .overrideProvider(EcmrService)
      .useValue(ecmrService)
      .overrideProvider(EthereumService)
      .useValue(ethereumService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST ecmr returns ecmr element`, () => {
    return request(app.getHttpServer())
      .post('/ecmr')
      .send(sampleRequest)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(sampleEcmr);
      });
  });

  it(`/POST ecmr return 400 because requestBody cannot be validated (malformed id)`, () => {
    const sampleIdErr = '900243253291859';
    const sampleRequestErr: EcmrRequestDto = { id: sampleIdErr, pin: samplePin } as EcmrRequestDto;

    return request(app.getHttpServer()).post('/ecmr').send(sampleRequestErr).expect(400);
  });

  it(`/POST ecmr return 400 because requestBody cannot be validated (malformed pin)`, () => {
    const samplePinErr = '123456';
    const sampleRequestErr: EcmrRequestDto = { id: sampleId, pin: samplePinErr } as EcmrRequestDto;

    return request(app.getHttpServer()).post('/ecmr').send(sampleRequestErr).expect(400);
  });

  it(`/POST ecmr/upload returns ecmr element`, () => {
    return request(app.getHttpServer())
      .post('/ecmr/upload')
      .attach('file', fileRequest)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(sampleEcmr);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
