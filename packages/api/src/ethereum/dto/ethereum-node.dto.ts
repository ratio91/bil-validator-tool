import { IsBoolean, IsString } from 'class-validator';

export class EthereumNodeDto {
  constructor(ethereumNode: string, isDefault: boolean) {
    this.ethereumNode = ethereumNode;
    this.isDefault = isDefault;
  }

  @IsString()
  readonly ethereumNode: string;

  @IsBoolean()
  readonly isDefault: boolean;
}
