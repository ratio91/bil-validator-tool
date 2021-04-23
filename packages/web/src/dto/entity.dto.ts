import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ContactDto } from './contact.dto';

export class EntityDto {
  @IsString()
  additional_information: string;

  @IsString()
  address: string;

  @IsString()
  cid: string;

  @IsString()
  city: string;

  @IsString()
  company_name: string;

  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @IsString()
  country: string;

  @IsString()
  postal: string;
}

export class EntityLocationDto extends EntityDto {
  @IsString()
  geocoordinates: string;
}
