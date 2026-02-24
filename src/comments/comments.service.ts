import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketComment } from '../entities/ticket-comment.entity';
import { Ticket } from '../entities/ticket.entity';
import { CommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(TicketComment)
        private readonly commentRepository: Repository<TicketComment>,
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
    ) { }

    private async checkTicketAccess(
        ticketId: number,
        user: { id: number; role: string },
    ): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) throw new NotFoundException(`Ticket ${ticketId} not found`);

        if (user.role === 'MANAGER') return ticket;
        if (user.role === 'SUPPORT' && ticket.assigned_to === user.id) return ticket;
        if (user.role === 'USER' && ticket.created_by === user.id) return ticket;
        throw new ForbiddenException('You do not have access to this ticket');
    }

    async addComment(
        ticketId: number,
        dto: CommentDto,
        user: { id: number; role: string },
    ): Promise<TicketComment> {
        await this.checkTicketAccess(ticketId, user);
        const comment = this.commentRepository.create({
            ticket_id: ticketId,
            user_id: user.id,
            comment: dto.comment,
        });
        return this.commentRepository.save(comment);
    }

    async getComments(
        ticketId: number,
        user: { id: number; role: string },
    ): Promise<TicketComment[]> {
        await this.checkTicketAccess(ticketId, user);
        return this.commentRepository.find({
            where: { ticket_id: ticketId },
            relations: ['user'],
            order: { created_at: 'ASC' },
        });
    }

    async updateComment(
        commentId: number,
        dto: CommentDto,
        user: { id: number; role: string },
    ): Promise<TicketComment> {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

        if (user.role !== 'MANAGER' && comment.user_id !== user.id) {
            throw new ForbiddenException('Only the comment author or MANAGER can edit this comment');
        }

        comment.comment = dto.comment;
        return this.commentRepository.save(comment);
    }

    async deleteComment(
        commentId: number,
        user: { id: number; role: string },
    ): Promise<void> {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

        if (user.role !== 'MANAGER' && comment.user_id !== user.id) {
            throw new ForbiddenException('Only the comment author or MANAGER can delete this comment');
        }

        await this.commentRepository.remove(comment);
    }
}
