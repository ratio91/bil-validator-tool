/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { Test } from '@nestjs/testing';
import { EventData } from 'web3-eth-contract';
import { EthereumService } from '../ethereum.service';
import { EcmrEventData } from '../dto/ecmr-event-data';

jest.mock('fs');
describe('EthereumService', () => {
  let ethereumService: EthereumService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EthereumService],
    }).compile();
    ethereumService = module.get<EthereumService>(EthereumService);
  });

  describe('getEcmrEventData', () => {
    const param = '0x69540db825fa2a0742c747186ccf835bc4955318e0aca43b00d48bc11ddbe681';
    const param1 = '0x41f594d2e806c266f74e12012c966f291ff635cc8625130dc93b6de27d41a2ed';
    const result = new EcmrEventData(
      '0x69540db825fa2a0742c747186ccf835bc4955318e0aca43b00d48bc11ddbe681',
      '0x41f594d2e806c266f74e12012c966f291ff635cc8625130dc93b6de27d41a2ed',
    );
    const sampleEvent: EventData = {
      returnValues: {
        latestEcmrHash: result.ecmrHash,
        latestPdfHash: result.pdfHash,
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

    it('should return a valid hash when event is found on the blockchain', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEvent];
      });

      expect(await ethereumService.getEcmrEventData(param, param1)).toStrictEqual(result);
    });

    it('should return throw an error when multiple events are found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [sampleEvent, sampleEvent];
      });

      await expect(ethereumService.getEcmrEventData(param, param1)).rejects.toThrow(Error);
    });

    it('should return throw an error when no event is found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        return [];
      });

      await expect(ethereumService.getEcmrEventData(param, param1)).rejects.toThrow(Error);
    });

    it('should return throw an error when web3 throws error', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(ethereumService.contractInstance, 'getPastEvents').mockImplementation(() => {
        throw new Error();
      });

      await expect(ethereumService.getEcmrEventData(param, param1)).rejects.toThrow(Error);
    });

    it(`should set new Provider`, async () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {});
      const newEthereumProvider = 'newEthereumProvider';

      await expect(ethereumService.changeEthereumNode(newEthereumProvider)).resolves.not.toThrow();
      await expect(ethereumService.getEthereumNode()).toBe(newEthereumProvider);
    });

    it(`should throw error and not set new Provider when it is malformed`, async () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {
        throw new Error('malformed');
      });
      const newEthereumProvider = 'newMalformedProvider';
      const oldEthereumProvider = ethereumService.getEthereumNode();

      await expect(ethereumService.changeEthereumNode(newEthereumProvider)).rejects.toThrow(Error);
      await expect(ethereumService.getEthereumNode()).toBe(oldEthereumProvider);
    });

    it(`should throw error and not set new Provider when it can't be connected to`, async () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(false);
      });
      // @ts-ignore
      jest.spyOn(ethereumService, 'setProvider').mockImplementation(() => {});
      const newEthereumProvider = 'newEthereumProvider';
      const oldEthereumProvider = ethereumService.getEthereumNode();

      await expect(ethereumService.changeEthereumNode(newEthereumProvider)).rejects.toThrow(Error);
      await expect(ethereumService.getEthereumNode()).toBe(oldEthereumProvider);
    });
  });
});
