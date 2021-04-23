import { IsArray, IsBoolean, IsDateString, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReferenceDto } from './reference.dto';
import { AttachmentDto } from './attachment.dto';
import { LoadDto } from './load.dto';
import { EntityDto, EntityLocationDto } from './entity.dto';
import { CommentDto } from './comment.dto';
import { DamageDto } from './damage.dto';
import { ContactDto } from './contact.dto';
import { EventDto } from './event.dto';
import { InstructionDto } from './instruction.dto';
import { VehicleDto } from './vehicle.dto';
import { SuccessiveDto } from './successive.dto';

export class EcmrDto {
  @ValidateNested()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];

  @ValidateNested()
  @Type(() => EntityDto)
  carrier: EntityDto;

  @ValidateNested()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @ValidateNested()
  @Type(() => EntityDto)
  consignee: EntityDto;

  @IsDateString()
  created_at: string;

  @ValidateNested()
  @Type(() => DamageDto)
  damages: DamageDto[];

  @ValidateNested()
  @Type(() => ContactDto)
  driver: ContactDto;

  @IsString()
  eid: string;

  @ValidateNested()
  @Type(() => EventDto)
  events: EventDto[];

  @ValidateNested()
  @Type(() => EntityDto)
  forwarder: EntityDto;

  @ValidateNested()
  @Type(() => InstructionDto)
  instructions: InstructionDto;

  @IsBoolean()
  is_dangerous: boolean;

  @ValidateNested()
  @Type(() => LoadDto)
  load: LoadDto[];

  @ValidateNested()
  @Type(() => ReferenceDto)
  references: ReferenceDto;

  @IsObject()
  roles: { [role_name: string]: string };

  @ValidateNested()
  @Type(() => EntityDto)
  sender: EntityDto;

  @ValidateNested()
  @Type(() => EntityLocationDto)
  shipper: EntityLocationDto;

  @IsNumber()
  sid: number;

  @ValidateNested()
  @Type(() => VehicleDto)
  succ_vehicles: VehicleDto[];

  @ValidateNested()
  @Type(() => SuccessiveDto)
  successives: SuccessiveDto[];

  @IsString()
  takeover_date: string;

  @ValidateNested()
  @Type(() => EntityLocationDto)
  unloader: EntityLocationDto;

  @IsDateString()
  updated_at: string;

  @IsArray()
  updates: any[];

  @ValidateNested()
  @Type(() => VehicleDto)
  vehicles: VehicleDto[];
}
