import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsDateString()
  @IsOptional()
  created_at: string;

  @IsString()
  eid: string;

  @IsString()
  reference_field: string;

  @IsArray()
  responsible_roles: string[];
}
