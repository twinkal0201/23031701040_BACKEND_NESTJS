import { User } from './user.entity';
import { TicketComment } from './ticket-comment.entity';
import { TicketStatusLog } from './ticket-status-log.entity';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export declare class Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_by: number;
    assigned_to: number | null;
    created_at: Date;
    creator: User;
    assignee: User | null;
    comments: TicketComment[];
    statusLogs: TicketStatusLog[];
}
