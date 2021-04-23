import { IsNumber, IsString, IsOptional } from 'class-validator';

export class LoadDto {
  @IsString()
  @IsOptional()
  _id: string;

  @IsString()
  @IsOptional()
  readonly marks: string;

  @IsNumber()
  @IsOptional()
  readonly number: number;

  @IsString()
  @IsOptional()
  readonly packing: string;

  @IsString()
  @IsOptional()
  readonly nature: string;

  @IsString()
  @IsOptional()
  readonly statistical_nr: string;

  @IsNumber()
  @IsOptional()
  readonly gross_weight: number;

  @IsNumber()
  @IsOptional()
  readonly volume: number;
}
