import { Module } from '@nestjs/common';
import { EcmrController } from './ecmr.controller';
import { EcmrService } from './ecmr.service';
import { EthereumModule } from '../ethereum/ethereum.module';

@Module({
  controllers: [EcmrController],
  providers: [EcmrService],
  imports: [EthereumModule],
})
export class EcmrModule {}
