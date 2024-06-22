import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule, SpotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
