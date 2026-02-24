import { Ticket } from './ticket.entity';
import { User } from './user.entity';
export declare class TicketComment {
    id: number;
    ticket_id: number;
    user_id: number;
    comment: string;
    created_at: Date;
    ticket: Ticket;
    user: User;
}
