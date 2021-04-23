import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityInputDto } from './entity.dto';

export class SuccessiveInputDto {
  @ValidateNested()
  @Type(() => EntityInputDto)
  @IsNotEmpty()
  readonly entity: EntityInputDto;
}
