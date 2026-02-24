import { CommentsService } from './comments.service';
import { CommentDto } from '../dto/comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    addComment(ticketId: number, dto: CommentDto, user: any): Promise<import("../entities/ticket-comment.entity").TicketComment>;
    getComments(ticketId: number, user: any): Promise<import("../entities/ticket-comment.entity").TicketComment[]>;
    updateComment(commentId: number, dto: CommentDto, user: any): Promise<import("../entities/ticket-comment.entity").TicketComment>;
    deleteComment(commentId: number, user: any): Promise<void>;
}
