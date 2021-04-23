/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { EthereumController } from '../ethereum.controller';
import { EthereumService } from '../ethereum.service';
import { EthereumNodeDto } from '../dto/ethereum-node.dto';

jest.mock('fs');

describe('EthereumController', () => {
  let ethereumController: EthereumController;
  let ethereumService: EthereumService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EthereumController],
      providers: [EthereumService],
    }).compile();

    ethereumService = module.get<EthereumService>(EthereumService);
    ethereumController = module.get<EthereumController>(EthereumController);
  });

  describe('getEndpoint', () => {
    it('should return the web3 endpoint', async () => {
      const resultNode = 'wss://kovan.infura.io/ws/v3/ccf79b7da84d45a1bbf83e5f432f0fb0';
      const resultIsDefault = true;

      const resultDto = new EthereumNodeDto(resultNode, resultIsDefault);

      jest.spyOn(ethereumService, 'getEthereumNode').mockImplementation(() => {
        return resultNode;
      });

      jest.spyOn(ethereumService, 'isUsingDefaultEthereumNode').mockImplementation(() => {
        return resultIsDefault;
      });

      expect(ethereumController.getEthereumNode()).toEqual(resultDto);
    });
  });

  describe('changeEndpoint', () => {
    const param = 'wss://kovan.infura.io/ws/v3/ccf79b7da84d45a1bbf83e5f432f0fb0';

    it('should return successfully', async () => {
      jest.spyOn(ethereumService, 'changeEthereumNode').mockImplementation(); // function does nothing

      await expect(ethereumController.changeEthereumNode(param)).resolves.not.toThrow();
    });

    it('should throw an error', async () => {
      jest.spyOn(ethereumService, 'changeEthereumNode').mockImplementation(() => {
        throw Error();
      });

      await expect(ethereumController.changeEthereumNode(param)).rejects.toThrow(HttpException);
    });

    it('should return successfully', async () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(true);
      });

      await expect(ethereumController.changeEthereumNode(param)).resolves.not.toThrow();
    });

    it('should throw an error', async () => {
      jest.spyOn(ethereumService, 'isConnected').mockImplementation(() => {
        return Promise.resolve(false);
      });

      await expect(ethereumController.changeEthereumNode(param)).rejects.toThrow(HttpException);
    });
  });
});
