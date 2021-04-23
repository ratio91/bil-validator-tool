import { Controller, Get, Put, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EthereumService } from './ethereum.service';
import { EthereumNodeDto } from './dto/ethereum-node.dto';

const WEB_APP = process.env.WEB_APP || false;

/** The EthereumController class implements controller endpoints that offer functionality to retrieve/change the ethereum node that is used for interaction with the blockchain. */
// @ApiBearerAuth()
// @ApiTags('ethereum')
@Controller('ethereum')
export class EthereumController {
  private readonly logger = new Logger(EthereumController.name);

  constructor(private readonly ethereumService: EthereumService) {}

  @Get('ethereumNode')
  // @ApiOperation({ summary: 'Retrieve ethereum ethereumNode (web3-endpoint)' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The current ethereumNode',
  // })
  getEthereumNode(): EthereumNodeDto {
    this.logger.log('getEthereumNode');
    return new EthereumNodeDto(
      this.ethereumService.getEthereumNode(),
      this.ethereumService.isUsingDefaultEthereumNode(),
    );
  }

  @Put('ethereumNode/:endpoint')
  // @ApiOperation({ summary: 'Change ethereumNode (web3-endpoint)' })
  // @ApiResponse({ status: 200, description: 'Successfully changed ethereumNode' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad Request (invalid endpoint or cannot connect)',
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden (it is not allowed to change the endpoint, is used e.g. when deployed as webapp)',
  // })
  async changeEthereumNode(@Param('endpoint') endpoint: string) {
    this.logger.log(`changeEthereumNode(endpoint: ${endpoint})`);
    if (WEB_APP) {
      this.logger.error(`changeEthereumNode is disabled, this endpoint is never called from the web frontend`);
      throw new HttpException('Cannot set endpoint', HttpStatus.FORBIDDEN);
    }
    try {
      await this.ethereumService.changeEthereumNode(endpoint);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('defaultEthereumNode')
  // @ApiOperation({ summary: 'Reset ethereumNodeAddress' })
  // @ApiResponse({ status: 200, description: 'Successfully reset ethereumNodeAddress' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad Request (invalid endpoint or cannot connect)',
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden (it is not allowed to change the endpoint, is used e.g. when deployed as webapp)',
  // })
  async resetEthereumNodeAddress(): Promise<string> {
    this.logger.log(`resetEthereumNodeAddress()`);
    if (WEB_APP) {
      this.logger.error(`resetEthereumNodeAddress is disabled, this endpoint is never called from the web frontend`);
      throw new HttpException('Cannot set endpoint', HttpStatus.FORBIDDEN);
    }
    try {
      return await this.ethereumService.resetEthereumNode();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
