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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketStatusLog = void 0;
const typeorm_1 = require("typeorm");
const ticket_entity_1 = require("./ticket.entity");
const user_entity_1 = require("./user.entity");
let TicketStatusLog = class TicketStatusLog {
    id;
    ticket_id;
    old_status;
    new_status;
    changed_by;
    changed_at;
    ticket;
    changedBy;
};
exports.TicketStatusLog = TicketStatusLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketStatusLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_id' }),
    __metadata("design:type", Number)
], TicketStatusLog.prototype, "ticket_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'old_status',
        type: 'enum',
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    }),
    __metadata("design:type", String)
], TicketStatusLog.prototype, "old_status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'new_status',
        type: 'enum',
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    }),
    __metadata("design:type", String)
], TicketStatusLog.prototype, "new_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', nullable: true }),
    __metadata("design:type", Object)
], TicketStatusLog.prototype, "changed_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], TicketStatusLog.prototype, "changed_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_1.Ticket, (t) => t.statusLogs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_id' }),
    __metadata("design:type", ticket_entity_1.Ticket)
], TicketStatusLog.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", Object)
], TicketStatusLog.prototype, "changedBy", void 0);
exports.TicketStatusLog = TicketStatusLog = __decorate([
    (0, typeorm_1.Entity)('ticket_status_logs')
], TicketStatusLog);
//# sourceMappingURL=ticket-status-log.entity.js.map