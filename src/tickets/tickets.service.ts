import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { TicketStatusLog } from '../entities/ticket-status-log.entity';
import { User } from '../entities/user.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { AssignDto } from '../dto/assign.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

const STATUS_ORDER: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(TicketStatusLog)
        private readonly logRepository: Repository<TicketStatusLog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto: CreateTicketDto, userId: number): Promise<Ticket> {
        const ticket = this.ticketRepository.create({
            title: dto.title,
            description: dto.description,
            priority: dto.priority || 'MEDIUM',
            status: 'OPEN',
            created_by: userId,
            assigned_to: null,
        });
        return this.ticketRepository.save(ticket);
    }

    async findAll(user: { id: number; role: string }): Promise<Ticket[]> {
        if (user.role === 'MANAGER') {
            return this.ticketRepository.find({
                relations: ['creator', 'assignee'],
                order: { created_at: 'DESC' },
            });
        }
        if (user.role === 'SUPPORT') {
            return this.ticketRepository.find({
                where: { assigned_to: user.id },
                relations: ['creator', 'assignee'],
                order: { created_at: 'DESC' },
            });
        }
        // USER
        return this.ticketRepository.find({
            where: { created_by: user.id },
            relations: ['creator', 'assignee'],
            order: { created_at: 'DESC' },
        });
    }

    async assign(id: number, dto: AssignDto, requesterId: number, requesterRole: string): Promise<Ticket> {
        const ticket = await this.getTicketOrThrow(id);

        // Validate assignee — cannot be USER role
        const assignee = await this.userRepository.findOne({
            where: { id: dto.assigned_to },
            relations: ['role'],
        });
        if (!assignee) throw new NotFoundException(`User ${dto.assigned_to} not found`);
        if (assignee.role.name === 'USER') {
            throw new BadRequestException('Tickets cannot be assigned to users with role USER');
        }

        ticket.assigned_to = dto.assigned_to;
        return this.ticketRepository.save(ticket);
    }

    async updateStatus(
        id: number,
        dto: UpdateStatusDto,
        changerId: number,
    ): Promise<Ticket> {
        const ticket = await this.getTicketOrThrow(id);
        const oldStatus = ticket.status;
        const newStatus = dto.status as TicketStatus;

        const oldIdx = STATUS_ORDER.indexOf(oldStatus);
        const newIdx = STATUS_ORDER.indexOf(newStatus);

        if (newIdx !== oldIdx + 1) {
            throw new BadRequestException(
                `Invalid status transition: ${oldStatus} → ${newStatus}. Allowed: OPEN→IN_PROGRESS→RESOLVED→CLOSED`,
            );
        }

        ticket.status = newStatus;
        await this.ticketRepository.save(ticket);

        // Log the transition
        const log = this.logRepository.create({
            ticket_id: id,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: changerId,
        });
        await this.logRepository.save(log);

        return ticket;
    }

    async delete(id: number): Promise<void> {
        const ticket = await this.getTicketOrThrow(id);
        await this.ticketRepository.remove(ticket);
    }

    async getTicketOrThrow(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['creator', 'assignee'],
        });
        if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
        return ticket;
    }

    async canAccessTicket(
        ticketId: number,
        user: { id: number; role: string },
    ): Promise<Ticket> {
        const ticket = await this.getTicketOrThrow(ticketId);
        if (user.role === 'MANAGER') return ticket;
        if (user.role === 'SUPPORT' && ticket.assigned_to === user.id) return ticket;
        if (user.role === 'USER' && ticket.created_by === user.id) return ticket;
        throw new ForbiddenException('You do not have access to this ticket');
    }
}
