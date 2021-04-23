import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class AttachmentDto {
  @IsString()
  @IsOptional()
  _id: string;

  @IsString()
  @IsNotEmpty()
  readonly file_hash: string;

  @IsString()
  @IsOptional()
  readonly file_name: string;

  @IsString()
  @IsOptional()
  readonly file_description: string;
}
