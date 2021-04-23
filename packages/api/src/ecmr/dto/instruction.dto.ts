import { IsOptional } from 'class-validator';

export class InstructionInputDto {
  @IsOptional()
  readonly sender: string;

  @IsOptional()
  readonly payment: string;

  @IsOptional()
  readonly carrier: string;

  @IsOptional()
  readonly agreements: string;
}
