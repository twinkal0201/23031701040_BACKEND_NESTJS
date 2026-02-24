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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_comment_entity_1 = require("../entities/ticket-comment.entity");
const ticket_entity_1 = require("../entities/ticket.entity");
let CommentsService = class CommentsService {
    commentRepository;
    ticketRepository;
    constructor(commentRepository, ticketRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
    }
    async checkTicketAccess(ticketId, user) {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
        if (!ticket)
            throw new common_1.NotFoundException(`Ticket ${ticketId} not found`);
        if (user.role === 'MANAGER')
            return ticket;
        if (user.role === 'SUPPORT' && ticket.assigned_to === user.id)
            return ticket;
        if (user.role === 'USER' && ticket.created_by === user.id)
            return ticket;
        throw new common_1.ForbiddenException('You do not have access to this ticket');
    }
    async addComment(ticketId, dto, user) {
        await this.checkTicketAccess(ticketId, user);
        const comment = this.commentRepository.create({
            ticket_id: ticketId,
            user_id: user.id,
            comment: dto.comment,
        });
        return this.commentRepository.save(comment);
    }
    async getComments(ticketId, user) {
        await this.checkTicketAccess(ticketId, user);
        return this.commentRepository.find({
            where: { ticket_id: ticketId },
            relations: ['user'],
            order: { created_at: 'ASC' },
        });
    }
    async updateComment(commentId, dto, user) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException(`Comment ${commentId} not found`);
        if (user.role !== 'MANAGER' && comment.user_id !== user.id) {
            throw new common_1.ForbiddenException('Only the comment author or MANAGER can edit this comment');
        }
        comment.comment = dto.comment;
        return this.commentRepository.save(comment);
    }
    async deleteComment(commentId, user) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException(`Comment ${commentId} not found`);
        if (user.role !== 'MANAGER' && comment.user_id !== user.id) {
            throw new common_1.ForbiddenException('Only the comment author or MANAGER can delete this comment');
        }
        await this.commentRepository.remove(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_comment_entity_1.TicketComment)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map