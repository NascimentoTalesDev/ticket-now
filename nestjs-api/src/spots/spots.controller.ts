import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto, @Param('eventId') eventId: string ) {  
    return this.spotsService.create({
      ...createSpotDto,
      eventId
    });
  }

  @Get()
  findAll() {
    return this.spotsService.findAll();
  }

  @Get(':spotId')
  findOne(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(spotId, eventId);
  }

  @Patch(':spotId')
  update(@Param('spotId') spotId: string, @Param('eventId') eventId: string, @Body() updateSpotDto: UpdateSpotDto) {
    return this.spotsService.update(spotId, eventId, updateSpotDto);
  }

  @HttpCode(204)
  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(spotId, eventId);
  }
}
