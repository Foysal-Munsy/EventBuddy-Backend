import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { BookEventDto } from './dto/book-event.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.eventRepository.remove(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findPrevious(): Promise<Event[]> {
    const now = new Date();
    return this.eventRepository.find({ where: { date: LessThan(now) } });
  }

  async findUpcoming(): Promise<Event[]> {
    const now = new Date();
    return this.eventRepository.find({ where: { date: MoreThan(now) } });
  }

  async bookSeats(
    id: number,
    userId: number,
    bookEventDto: BookEventDto,
  ): Promise<{ message: string; event: Event; booking: Booking }> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const availableSeats = event.totalSeats - event.bookedSeats;
    if (availableSeats < bookEventDto.seats) {
      throw new BadRequestException(
        `Only ${availableSeats} seats available. You requested ${bookEventDto.seats} seats.`,
      );
    }

    event.bookedSeats += bookEventDto.seats;
    const updatedEvent = await this.eventRepository.save(event);

    // Create booking record
    const booking = this.bookingRepository.create({
      userId,
      eventId: id,
      seats: bookEventDto.seats,
    });
    const savedBooking = await this.bookingRepository.save(booking);

    return {
      message: `Successfully booked ${bookEventDto.seats} seat(s)`,
      event: updatedEvent,
      booking: savedBooking,
    };
  }

  async getMyBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['event'],
      order: { bookedAt: 'DESC' },
    });
  }
}
