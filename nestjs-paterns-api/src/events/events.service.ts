import { HttpCode, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { ReserveSpotDto } from 'src/spots/dto/reserve-spot.dto';

@Injectable()
export class EventsService {
  
  constructor(private prismaService: PrismaService) {};

  create(createEventDto: CreateEventDto) {    
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      }
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(eventId: string) {
    return this.prismaService.event.findFirst({
      where: {
        id: eventId
      }
    });
  }

  update(eventId: string, updateEventDto: UpdateEventDto) {    
    return this.prismaService.event.update({
      where:{
        id: eventId
      },
      data:{
          ...updateEventDto,
          date: new Date(updateEventDto.date),
      }
    });
  }

  @HttpCode(204)
  remove(eventId: string) {
    return this.prismaService.event.delete({
      where: {
        id: eventId
      }
    });
  }

  async reserveSpot(reserveSpotDto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveSpotDto.eventId,
        name: {
          in: reserveSpotDto.spots,
        },
      },
    });

    if (spots.length !== reserveSpotDto.spots.length) {
      const foundSpotName = spots.map((spot) => spot.name);
      const notFoundSpotsName = reserveSpotDto.spots.filter(
        (spotName) => !foundSpotName.includes(spotName),
      );
      throw new Error(`Spots ${notFoundSpotsName.join(', ')} not found`);
    }

    try {
      const tickets = await this.prismaService.$transaction(async (prisma) => {
        await prisma.reservationHistory.createMany({
          data: spots.map((spot) => ({
            spotId: spot.id,
            ticketKind: reserveSpotDto.ticket_kind,
            email: reserveSpotDto.email,
            status: TicketStatus.reserved,
          })),
        });

        await prisma.spot.updateMany({
          where: {
            id: {
              in: spots.map((spot) => spot.id),
            },
          },
          data: {
            status: SpotStatus.reserved,
          },
        });

        const tickets = await Promise.all(
          spots.map((spots) =>
            prisma.ticket.create({
              data: {
                spotId: spots.id,
                ticketKind: reserveSpotDto.ticket_kind,
                email: reserveSpotDto.email,
              },
            }),
          ),
        );

        return tickets;
      
      }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
      
      return tickets;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
          case 'P2034':
            throw new Error('Some spots are already reserved');
        }
      }
      throw error;
    }
  }
}
