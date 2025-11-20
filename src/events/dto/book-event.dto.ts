import { IsNumber, Min, Max } from 'class-validator';

export class BookEventDto {
  @IsNumber()
  @Min(1, { message: 'You must book at least 1 seat' })
  @Max(4, { message: 'You can book maximum 4 seats' })
  seats: number;
}
