import { IsString, IsOptional } from 'class-validator';

export class HistoryDto {
  @IsString()
  @IsOptional()
  _id: string;

  content: object;

  previous_ecmr_hash: string;

  previous_sid: number;

  responsible_uid: string;

  responsible_roles?: string[];

  reference_field: string;

  created_at: string;
}
