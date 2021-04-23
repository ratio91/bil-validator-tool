import { IsArray, IsDateString, IsString } from 'class-validator';

export class CommentDto {
  @IsDateString()
  created_at: string;

  @IsString()
  reference_field: string;

  @IsArray()
  responsible_roles: string[];

  @IsString()
  text: string;
}
