import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  Min,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Event title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Event description is required' })
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Event date is required' })
  date: Date;

  @IsString()
  @IsNotEmpty({ message: 'Event location is required' })
  location: string;

  @IsNumber()
  @Min(4, { message: 'Total seats must be at least 4' })
  totalSeats: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
