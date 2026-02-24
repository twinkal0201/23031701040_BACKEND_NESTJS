import { Ticket } from './ticket.entity';
import { User } from './user.entity';
export declare class TicketStatusLog {
    id: number;
    ticket_id: number;
    old_status: string;
    new_status: string;
    changed_by: number | null;
    changed_at: Date;
    ticket: Ticket;
    changedBy: User | null;
}
