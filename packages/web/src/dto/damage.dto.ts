import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AttachmentDto } from './attachment.dto';

export class DamageDto {
  @IsDateString()
  @IsOptional()
  created_at: string;

  @ValidateNested()
  @Type(() => AttachmentDto)
  files: AttachmentDto[];

  @IsArray()
  responsible_roles: string[];

  @IsString()
  text: string;
}
