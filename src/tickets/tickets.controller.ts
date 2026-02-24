import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { AssignDto } from '../dto/assign.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles('USER', 'MANAGER')
    @HttpCode(201)
    @ApiOperation({ summary: 'Create ticket (USER, MANAGER)' })
    @ApiResponse({ status: 201, description: 'Ticket created' })
    async create(@Body() dto: CreateTicketDto, @CurrentUser() user: any) {
        return this.ticketsService.create(dto, user.id);
    }

    @Get()
    @Roles('MANAGER', 'SUPPORT', 'USER')
    @ApiOperation({ summary: 'Get tickets (MANAGER=all, SUPPORT=assigned, USER=own)' })
    async findAll(@CurrentUser() user: any) {
        return this.ticketsService.findAll(user);
    }

    @Patch(':id/assign')
    @Roles('MANAGER', 'SUPPORT')
    @ApiOperation({ summary: 'Assign ticket (MANAGER, SUPPORT)' })
    @ApiResponse({ status: 200, description: 'Ticket assigned' })
    @ApiResponse({ status: 400, description: 'Cannot assign to USER-role user' })
    @ApiResponse({ status: 404, description: 'Ticket or user not found' })
    async assign(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssignDto,
        @CurrentUser() user: any,
    ) {
        return this.ticketsService.assign(id, dto, user.id, user.role);
    }

    @Patch(':id/status')
    @Roles('MANAGER', 'SUPPORT')
    @ApiOperation({ summary: 'Update ticket status (MANAGER, SUPPORT)' })
    @ApiResponse({ status: 200, description: 'Status updated' })
    @ApiResponse({ status: 400, description: 'Invalid status transition' })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStatusDto,
        @CurrentUser() user: any,
    ) {
        return this.ticketsService.updateStatus(id, dto, user.id);
    }

    @Delete(':id')
    @Roles('MANAGER')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete ticket (MANAGER)' })
    @ApiResponse({ status: 204, description: 'Ticket deleted' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.ticketsService.delete(id);
    }
}
