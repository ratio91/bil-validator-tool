import { IsString } from 'class-validator';

export class InstructionDto {
  @IsString()
  agreements: string;

  @IsString()
  carrier: string;

  @IsString()
  payment: string;

  @IsString()
  sender: string;
}
