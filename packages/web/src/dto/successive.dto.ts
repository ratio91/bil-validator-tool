import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContactDto } from './contact.dto';
import { EntityDto } from './entity.dto';

export class SuccessiveDto {
  @ValidateNested()
  @Type(() => ContactDto)
  drivers: ContactDto;

  @ValidateNested()
  @Type(() => EntityDto)
  entity: EntityDto;
}
