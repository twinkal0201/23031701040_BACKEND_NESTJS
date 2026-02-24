"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("../entities/ticket.entity");
const ticket_status_log_entity_1 = require("../entities/ticket-status-log.entity");
const user_entity_1 = require("../entities/user.entity");
const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
let TicketsService = class TicketsService {
    ticketRepository;
    logRepository;
    userRepository;
    constructor(ticketRepository, logRepository, userRepository) {
        this.ticketRepository = ticketRepository;
        this.logRepository = logRepository;
        this.userRepository = userRepository;
    }
    async create(dto, userId) {
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
    async findAll(user) {
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
        return this.ticketRepository.find({
            where: { created_by: user.id },
            relations: ['creator', 'assignee'],
            order: { created_at: 'DESC' },
        });
    }
    async assign(id, dto, requesterId, requesterRole) {
        const ticket = await this.getTicketOrThrow(id);
        const assignee = await this.userRepository.findOne({
            where: { id: dto.assigned_to },
            relations: ['role'],
        });
        if (!assignee)
            throw new common_1.NotFoundException(`User ${dto.assigned_to} not found`);
        if (assignee.role.name === 'USER') {
            throw new common_1.BadRequestException('Tickets cannot be assigned to users with role USER');
        }
        ticket.assigned_to = dto.assigned_to;
        return this.ticketRepository.save(ticket);
    }
    async updateStatus(id, dto, changerId) {
        const ticket = await this.getTicketOrThrow(id);
        const oldStatus = ticket.status;
        const newStatus = dto.status;
        const oldIdx = STATUS_ORDER.indexOf(oldStatus);
        const newIdx = STATUS_ORDER.indexOf(newStatus);
        if (newIdx !== oldIdx + 1) {
            throw new common_1.BadRequestException(`Invalid status transition: ${oldStatus} → ${newStatus}. Allowed: OPEN→IN_PROGRESS→RESOLVED→CLOSED`);
        }
        ticket.status = newStatus;
        await this.ticketRepository.save(ticket);
        const log = this.logRepository.create({
            ticket_id: id,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: changerId,
        });
        await this.logRepository.save(log);
        return ticket;
    }
    async delete(id) {
        const ticket = await this.getTicketOrThrow(id);
        await this.ticketRepository.remove(ticket);
    }
    async getTicketOrThrow(id) {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['creator', 'assignee'],
        });
        if (!ticket)
            throw new common_1.NotFoundException(`Ticket ${id} not found`);
        return ticket;
    }
    async canAccessTicket(ticketId, user) {
        const ticket = await this.getTicketOrThrow(ticketId);
        if (user.role === 'MANAGER')
            return ticket;
        if (user.role === 'SUPPORT' && ticket.assigned_to === user.id)
            return ticket;
        if (user.role === 'USER' && ticket.created_by === user.id)
            return ticket;
        throw new common_1.ForbiddenException('You do not have access to this ticket');
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_status_log_entity_1.TicketStatusLog)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map