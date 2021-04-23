/**
 * @jest-environment node
 */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-throw-literal */
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventData } from 'web3-eth-contract';

import { EcmrModule } from '../ecmr/ecmr.module';
import { exampleJson } from '../ecmr/test/resources/exampleJson';
import { EcmrRequestDto } from '../ecmr/dto/ecmr-request.dto';
import { EcmrDto } from '../ecmr/dto/ecmr.dto';
import mockAxios from '../ecmr/test/__mocks__/axios';
import { EcmrService } from '../ecmr/ecmr.service';
import { EthereumService } from '../ethereum/ethereum.service';
import { EcmrEventData } from '../ethereum/dto/ecmr-event-data';
import { EthereumModule } from '../ethereum/ethereum.module';
import { EthereumNodeDto } from '../ethereum/dto/ethereum-node.dto';

describe('Ecmr', () => {
  let app: INestApplication;
  let ecmrService: EcmrService;
  let ethereumService: EthereumService;

  const sampleEcmr: EcmrDto = (exampleJson as unknown) as EcmrDto;
  const sampleRequest = { id: sampleEcmr.eid, pin: '12345' } as EcmrRequestDto;
  const sampleFileRequest = 'src/ecmr/test/resources/validEcmr.pdf';
  const sampleEcmrEventData = new EcmrEventData(
    '0x69540db825fa2a0742c747186ccf835bc4955318e0aca43b00d48bc11ddbe681',
    '0x41f594d2e806c266f74e12012c966f291ff635cc8625130dc93b6de27d41a2ed',
  );
  const sampleEvent: EventData = {
    returnValues: {
      id: '1337',
      latestEcmrHash: sampleEcmrEventData.ecmrHash,
      latestPdfHash: sampleEcmrEventData.pdfHash,
    },
    raw: { data: '0x', topics: [] },
    event: 'EcmrUpdate',
    signature: '0x82dc180453632a9e9283442b9cac4b03ca8c2c7cb875edc6ec52ae596f9c9cd6',
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x2f836973f267eea4c388bc555dbde5286ff80d926683a3858a00026418e50667',
    blockHash: '0x1c02de487ee4cd41ecc9499749d89de8111c99c25ecd78d311e6b3ad225222b4',
    blockNumber: 17862373,
    address: '0x80ddc070AEa4761B96FE3d9cd55C44b55Bca9f19',
  };

  beforeAll(async () => {
    ethereumService = new EthereumService();

    const moduleRef = await Test.createTestingModule({
      imports: [EcmrModule, EthereumModule],
    })
      .overrideProvider(EthereumService)
      .useValue(ethereumService)
      .compile();

    app = moduleRef.createNestApplication();
    ecmrService = app.get<EcmrService>(EcmrService);
    await app.init();

    // getRestEndpoint returns the appropriate Endpoint for an eCMR Id. It is mocked for testing,
    // since test data might not be present in the used config file.
    jest.spyOn(ecmrService, 'getRestEndpoint').mockImplementation(() => {
      return 'restEndpoint';
    });
  });

  beforeEach(async () => {
    // mock call to external rest system
    // @ts-ignore
    mockAxios.post.mockImplementation(() => {
      return Promise.resolve({ data: exampleJson });
    });
    // mock access to blockchain
    // @ts-ignore
    jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
      return [sampleEvent];
    });
  });

  describe('POST /ecmr', () => {
    it(`should return valid eCMR on valid request`, () => {
      return request(app.getHttpServer())
        .post('/ecmr')
        .send(sampleRequest)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(sampleEcmr);
        });
    });

    it(`should return http status 400 when eCMR id is malformed`, () => {
      const sampleIdErr = '900243253291859';
      const sampleRequestErr: EcmrRequestDto = { id: sampleIdErr, pin: sampleRequest.pin } as EcmrRequestDto;

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequestErr).expect(400);
    });

    it(`should return http status 400 when eCMR pin is malformed`, () => {
      const samplePinErr = '123456';
      const sampleRequestErr: EcmrRequestDto = { id: sampleRequest.id, pin: samplePinErr } as EcmrRequestDto;

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequestErr).expect(400);
    });

    it('should return http status 401 when eCMR rest endpoint returns 401', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 401 } };
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(401);
    });

    it('should return http status 403 when eCMR rest endpoint returns 403', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 403 } };
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(403);
    });

    it('should return http status 404 when eCMR rest call fails without status', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw new Error('Error retrieving eCMR Data');
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(404);
    });

    it('should return http status 404 when an error occurs while fetching EventData', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        throw new Error('Error reading blockchain');
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(404);
    });

    it('should return http status 404 when no EventData is found', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [];
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(404);
    });

    it('should return http status 404 when multiple instances of EventData are found', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEvent, sampleEvent];
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(404);
    });

    it("should return http status 422 when eCMR hash doesn't match hash on blockchain", async () => {
      const sampleEventInvalidEcmrHash: EventData = JSON.parse(JSON.stringify(sampleEvent)); // deep copy of sample event
      sampleEventInvalidEcmrHash.returnValues.latestEcmrHash = 'invalid hash';
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEventInvalidEcmrHash];
      });

      return request(app.getHttpServer()).post('/ecmr').send(sampleRequest).expect(422);
    });
  });

  describe('POST /ecmr/upload', () => {
    it(`should return valid eCMR on valid request`, () => {
      return request(app.getHttpServer())
        .post('/ecmr/upload')
        .attach('file', sampleFileRequest)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(sampleEcmr);
        });
    });

    it(`should return http status 400 when file is not a valid pdf`, () => {
      const invalidFileRequest = 'src/ecmr/test/resources/invalidFile.png';
      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', invalidFileRequest).expect(400);
    });

    it(`should return http status 400 when eCMR id cannot be parsed from pdf`, () => {
      const invalidIdRequest = 'src/ecmr/test/resources/invalidIdEcmr.pdf';
      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', invalidIdRequest).expect(400);
    });

    it(`should return http status 400 when pin code cannot be parsed from pdf`, () => {
      const invalidPinRequest = 'src/ecmr/test/resources/invalidPinEcmr.pdf';
      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', invalidPinRequest).expect(400);
    });

    it('should return http status 401 when eCMR rest endpoint returns 401', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 401 } };
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(401);
    });

    it('should return http status 403 when eCMR rest endpoint returns 403', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw { response: { status: 403 } };
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(403);
    });

    it('should return http status 404 when eCMR rest call fails without status', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation(() => {
        throw new Error('Error retrieving eCMR Data');
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(404);
    });

    it('should return http status 404 when an error occurs while fetching EventData', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        throw new Error('Error reading blockchain');
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(404);
    });

    it('should return http status 404 when no EventData is found', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [];
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(404);
    });

    it('should return http status 404 when multiple instances of EventData are found', async () => {
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEvent, sampleEvent];
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(404);
    });

    it("should return http status 422 when eCMR hash doesn't match hash on blockchain", async () => {
      const sampleEventInvalidEcmrHash: EventData = JSON.parse(JSON.stringify(sampleEvent));
      sampleEventInvalidEcmrHash.returnValues.latestEcmrHash = 'invalid hash';
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEventInvalidEcmrHash];
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(422);
    });

    it("should return http status 422 when pdf hash doesn't match hash on blockchain", async () => {
      const sampleEventInvalidPdfHash: EventData = JSON.parse(JSON.stringify(sampleEvent)); // deep copy of sampleEvent
      sampleEventInvalidPdfHash.returnValues.latestPdfHash = 'invalid hash';
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEventInvalidPdfHash];
      });

      return request(app.getHttpServer()).post('/ecmr/upload').attach('file', sampleFileRequest).expect(422);
    });
  });

  describe('GET /ethereumNode', () => {
    it(`should return the current ethereum node`, () => {
      return request(app.getHttpServer())
        .get('/ethereum/ethereumNode')
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.text).toMatch(
            JSON.stringify(
              new EthereumNodeDto(ethereumService.getEthereumNode(), ethereumService.isUsingDefaultEthereumNode()),
            ),
          );
        });
    });

    it(`should set new Provider`, () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {});
      const newEthereumProvider = 'newEthereumProvider';
      return request(app.getHttpServer())
        .put(`/ethereum/ethereumNode/${newEthereumProvider}`)
        .send()
        .expect(200)
        .expect(() => {
          expect(ethereumService.getEthereumNode() === newEthereumProvider);
        });
    });

    it(`should throw http status 400 and not set new Provider when it is malformed`, () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {
        throw new Error('malformed');
      });
      const newEthereumProvider = 'newEthereumProvider';
      const oldEthereumProvider = ethereumService.getEthereumNode();
      return request(app.getHttpServer())
        .put(`/ethereum/ethereumNode/${newEthereumProvider}`)
        .send()
        .expect(400)
        .expect(() => {
          expect(ethereumService.getEthereumNode() === oldEthereumProvider);
        });
    });

    it(`should throw http status 400 and not set new Provider when it can't be connected to`, () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(false);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {});
      const newEthereumProvider = 'newEthereumProvider';
      const oldEthereumProvider = ethereumService.getEthereumNode();
      return request(app.getHttpServer())
        .put(`/ethereum/ethereumNode/${newEthereumProvider}`)
        .send()
        .expect(400)
        .expect(() => {
          expect(ethereumService.getEthereumNode() === oldEthereumProvider);
        });
    });

    it(`should return http status 200 and reset Ethereum Node`, () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {});

      // @ts-ignore
      ethereumService.defaultNode = 'defaultNode';

      return request(app.getHttpServer())
        .get(`/ethereum/defaultEthereumNode`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.text).toMatch('defaultNode');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
