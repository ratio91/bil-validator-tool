import { Module } from '@nestjs/common';

import { EcmrModule } from './ecmr/ecmr.module';
import { EthereumModule } from './ethereum/ethereum.module';

@Module({
  imports: [EcmrModule, EthereumModule],
})
export class AppModule {}
