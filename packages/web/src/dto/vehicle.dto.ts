import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VehicleDto {
  @IsString()
  type: string;

  @IsString()
  registration: string;

  @IsString()
  ilu: string;

  @IsNumber()
  @IsOptional()
  capacity: number;
}
