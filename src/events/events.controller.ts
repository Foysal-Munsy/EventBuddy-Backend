import {
  Controller,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { BookEventDto } from './dto/book-event.dto';
import { Booking } from './entities/booking.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(): Promise<Event[]> {
    return await this.eventsService.findAll();
  }

  @Get('previous')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('admin')
  async findPrevious(): Promise<Event[]> {
    return await this.eventsService.findPrevious();
  }

  @Get('upcoming')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('admin')
  async findUpcoming(): Promise<Event[]> {
    return await this.eventsService.findUpcoming();
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async getMyBookings(@CurrentUser() user: any): Promise<Booking[]> {
    return await this.eventsService.getMyBookings(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return await this.eventsService.findOne(id);
  }

  @Post(':id/book')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async bookSeats(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() bookEventDto: BookEventDto,
  ) {
    return await this.eventsService.bookSeats(id, user.id, bookEventDto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.eventsService.remove(id);
    return { message: 'Event deleted successfully' };
  }
}
