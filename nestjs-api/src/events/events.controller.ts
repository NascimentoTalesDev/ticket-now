import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':eventId')
  findOne(@Param('eventId') eventId: string) {
    return this.eventsService.findOne(eventId);
  }

  @Patch(':eventId')
  update(@Param('eventId') eventId: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @Delete(':eventId')
  remove(@Param('eventId') eventId: string) {
    return this.eventsService.remove(eventId);
  }
}
