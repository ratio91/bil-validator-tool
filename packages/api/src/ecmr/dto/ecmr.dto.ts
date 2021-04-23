import {
  IsDateString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityInputDto } from './entity.dto';
import { LoadDto } from './load.dto';
import { AttachmentDto } from './attachment.dto';
import { VehicleInputDto } from './vehicle.dto';
import { ReferenceInputDto } from './reference.dto';
import { InstructionInputDto } from './instruction.dto';
import { SuccessiveInputDto } from './successive.dto';

export class EcmrDto {
  @IsString()
  @IsOptional()
  _id: string;

  @IsString()
  eid: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly forwarder: EntityInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly sender: EntityInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly consignee: EntityInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly unloader: EntityInputDto;

  @IsDateString()
  @IsOptional()
  readonly takeover_date: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly shipper: EntityInputDto;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => AttachmentDto)
  readonly attachments: AttachmentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => LoadDto)
  readonly load: LoadDto[];

  @IsBoolean()
  @IsOptional()
  readonly is_dangerous: boolean;

  @IsOptional()
  @IsObject()
  readonly instructions: InstructionInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityInputDto)
  readonly carrier: EntityInputDto;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => SuccessiveInputDto)
  readonly successives: SuccessiveInputDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleInputDto)
  readonly vehicles: VehicleInputDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleInputDto)
  readonly succ_vehicles: VehicleInputDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ReferenceInputDto)
  readonly references: ReferenceInputDto;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @IsNumber()
  __v: number;
}
