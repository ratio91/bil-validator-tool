import { IsString, Length } from 'class-validator';

export class PinDto {
  constructor(pin: string) {
    this.pin = pin;
  }

  @IsString()
  @Length(5, 5, { message: 'PIN must be 5 characters in length' })
  readonly pin: string;
}
