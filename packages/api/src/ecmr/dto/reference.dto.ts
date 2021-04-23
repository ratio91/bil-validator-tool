import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonReferenceDto } from './common-reference.dto';

export class ReferenceInputDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CommonReferenceDto)
  readonly common: CommonReferenceDto[];

  @IsOptional()
  @IsString()
  readonly principal: string;

  @IsOptional()
  @IsString()
  readonly forwarder: string;

  @IsOptional()
  @IsString()
  readonly sender: string;

  @IsOptional()
  @IsString()
  readonly shipper: string;

  @IsOptional()
  @IsString()
  readonly carrier: string;

  @IsOptional()
  @IsString()
  readonly successives: string;

  @IsOptional()
  @IsString()
  readonly consignee: string;

  @IsOptional()
  @IsString()
  readonly unloader: string;
}
