import { IsOptional, IsString } from 'class-validator';

export class EntityInputDto {
  @IsString()
  @IsOptional()
  readonly company_name: string;

  @IsString()
  @IsOptional()
  readonly cid?: string;

  @IsString()
  readonly address: string;

  @IsString()
  @IsOptional()
  readonly postal: string;

  @IsString()
  @IsOptional()
  readonly city: string;

  @IsString()
  @IsOptional()
  readonly country: string;

  @IsOptional()
  readonly geocoordinates: string;

  @IsOptional()
  readonly additional_information: string;
}
