import { IsString, Length } from 'class-validator';

export class EcmrRequestDto {
  constructor(id: string, pin: string) {
    this.id = id;
    this.pin = pin;
  }

  // eCMR-Id has 20 digits, tid must have 4 digits
  @IsString()
  readonly id: string;

  @IsString()
  @Length(5, 5, { message: 'pin must be exactly 5 characters in length' })
  readonly pin: string;
}
