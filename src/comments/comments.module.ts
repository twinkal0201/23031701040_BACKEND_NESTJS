import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketComment } from '../entities/ticket-comment.entity';
import { Ticket } from '../entities/ticket.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    imports: [TypeOrmModule.forFeature([TicketComment, Ticket])],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule { }
