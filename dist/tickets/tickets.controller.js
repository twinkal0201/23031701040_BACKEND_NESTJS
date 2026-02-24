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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tickets_service_1 = require("./tickets.service");
const create_ticket_dto_1 = require("../dto/create-ticket.dto");
const assign_dto_1 = require("../dto/assign.dto");
const update_status_dto_1 = require("../dto/update-status.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const current_user_decorator_1 = require("../common/current-user.decorator");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async create(dto, user) {
        return this.ticketsService.create(dto, user.id);
    }
    async findAll(user) {
        return this.ticketsService.findAll(user);
    }
    async assign(id, dto, user) {
        return this.ticketsService.assign(id, dto, user.id, user.role);
    }
    async updateStatus(id, dto, user) {
        return this.ticketsService.updateStatus(id, dto, user.id);
    }
    async delete(id) {
        await this.ticketsService.delete(id);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('USER', 'MANAGER'),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: 'Create ticket (USER, MANAGER)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ticket created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('MANAGER', 'SUPPORT', 'USER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tickets (MANAGER=all, SUPPORT=assigned, USER=own)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, roles_decorator_1.Roles)('MANAGER', 'SUPPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign ticket (MANAGER, SUPPORT)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket assigned' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot assign to USER-role user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket or user not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assign_dto_1.AssignDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('MANAGER', 'SUPPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket status (MANAGER, SUPPORT)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_status_dto_1.UpdateStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('MANAGER'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ticket (MANAGER)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Ticket deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "delete", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('Tickets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map