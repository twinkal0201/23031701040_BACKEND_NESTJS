import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatusLog } from '../entities/ticket-status-log.entity';
import { User } from '../entities/user.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { AssignDto } from '../dto/assign.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
export declare class TicketsService {
    private readonly ticketRepository;
    private readonly logRepository;
    private readonly userRepository;
    constructor(ticketRepository: Repository<Ticket>, logRepository: Repository<TicketStatusLog>, userRepository: Repository<User>);
    create(dto: CreateTicketDto, userId: number): Promise<Ticket>;
    findAll(user: {
        id: number;
        role: string;
    }): Promise<Ticket[]>;
    assign(id: number, dto: AssignDto, requesterId: number, requesterRole: string): Promise<Ticket>;
    updateStatus(id: number, dto: UpdateStatusDto, changerId: number): Promise<Ticket>;
    delete(id: number): Promise<void>;
    getTicketOrThrow(id: number): Promise<Ticket>;
    canAccessTicket(ticketId: number, user: {
        id: number;
        role: string;
    }): Promise<Ticket>;
}
