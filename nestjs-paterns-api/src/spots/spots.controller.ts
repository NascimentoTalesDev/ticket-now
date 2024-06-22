import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotsService.create(createSpotDto);
  }

  @Get()
  findAll() {
    return this.spotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpotDto: UpdateSpotDto) {
    return this.spotsService.update(+id, updateSpotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotsService.remove(+id);
  }
}
