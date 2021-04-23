import { IsOptional, IsString } from 'class-validator';

export class ReferenceDto {
  @IsString()
  @IsOptional()
  carrier: string;

  @IsOptional()
  common: any;

  @IsString()
  @IsOptional()
  consignee: string;

  @IsString()
  @IsOptional()
  forwarder: string;

  @IsString()
  @IsOptional()
  principal: string;

  @IsString()
  @IsOptional()
  sender: string;

  @IsString()
  @IsOptional()
  shipper: string;

  @IsString()
  @IsOptional()
  successives: string;

  @IsString()
  @IsOptional()
  unloader: string;
}
