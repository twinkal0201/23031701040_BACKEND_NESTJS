import { Repository } from 'typeorm';
import { TicketComment } from '../entities/ticket-comment.entity';
import { Ticket } from '../entities/ticket.entity';
import { CommentDto } from '../dto/comment.dto';
export declare class CommentsService {
    private readonly commentRepository;
    private readonly ticketRepository;
    constructor(commentRepository: Repository<TicketComment>, ticketRepository: Repository<Ticket>);
    private checkTicketAccess;
    addComment(ticketId: number, dto: CommentDto, user: {
        id: number;
        role: string;
    }): Promise<TicketComment>;
    getComments(ticketId: number, user: {
        id: number;
        role: string;
    }): Promise<TicketComment[]>;
    updateComment(commentId: number, dto: CommentDto, user: {
        id: number;
        role: string;
    }): Promise<TicketComment>;
    deleteComment(commentId: number, user: {
        id: number;
        role: string;
    }): Promise<void>;
}
