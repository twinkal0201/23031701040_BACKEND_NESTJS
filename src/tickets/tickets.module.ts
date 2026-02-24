import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatusLog } from '../entities/ticket-status-log.entity';
import { User } from '../entities/user.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, TicketStatusLog, User])],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
