import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AttachmentDto {
  @IsString()
  file_hash: string;

  @IsString()
  @IsOptional()
  file_name: string;

  @IsString()
  @IsOptional()
  file_description: string;

  @IsNumber()
  @IsOptional()
  file_size: number;

  @IsDateString()
  @IsOptional()
  created_at: string;

  @IsDateString()
  @IsOptional()
  updated_at: string;

  @IsDateString()
  @IsOptional()
  updatedAt: string;
}
