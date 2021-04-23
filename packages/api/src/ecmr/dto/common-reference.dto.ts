import { IsOptional, IsString } from 'class-validator';

export class CommonReferenceDto {
  @IsString()
  readonly key: string;

  @IsOptional()
  @IsString()
  readonly value: string;
}
