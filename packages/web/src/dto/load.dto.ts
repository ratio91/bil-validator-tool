import { IsNumber, IsString } from 'class-validator';

export class LoadDto {
  @IsString()
  _id: string;

  @IsString()
  marks: string;

  @IsNumber()
  number: number;

  @IsString()
  packing: string;

  @IsString()
  nature: string;

  @IsString()
  statistical_nr: string;

  @IsNumber()
  gross_weight: number;

  @IsNumber()
  volume: number;
}
