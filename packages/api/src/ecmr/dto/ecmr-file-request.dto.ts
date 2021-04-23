import { IsString } from 'class-validator';

export class EcmrFileRequestDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly fieldname: string;

  @IsString()
  readonly originalname: string;

  @IsString()
  readonly encoding: string;

  @IsString()
  readonly mimetype: string;

  readonly buffer: Buffer;

  readonly size: number;
}
