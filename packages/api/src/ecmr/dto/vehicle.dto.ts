import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class VehicleInputDto {
  @IsEnum(['TRUCK', 'TRAILER'])
  readonly type: string;

  @IsString()
  readonly registration: string;

  @IsString()
  @IsOptional()
  readonly ilu: string;

  @IsNumber()
  @IsOptional()
  readonly capacity: number;
}
