import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { AssignDto } from '../dto/assign.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(dto: CreateTicketDto, user: any): Promise<import("../entities/ticket.entity").Ticket>;
    findAll(user: any): Promise<import("../entities/ticket.entity").Ticket[]>;
    assign(id: number, dto: AssignDto, user: any): Promise<import("../entities/ticket.entity").Ticket>;
    updateStatus(id: number, dto: UpdateStatusDto, user: any): Promise<import("../entities/ticket.entity").Ticket>;
    delete(id: number): Promise<void>;
}
