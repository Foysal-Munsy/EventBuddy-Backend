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

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Event title cannot be empty' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Event description cannot be empty' })
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Event location cannot be empty' })
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(4, { message: 'Total seats must be at least 4' })
  totalSeats?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
