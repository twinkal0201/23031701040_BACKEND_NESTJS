import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles('MANAGER')
    @HttpCode(201)
    @ApiOperation({ summary: 'Create user (MANAGER only)' })
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?.name,
            created_at: user.created_at,
        };
    }

    @Get()
    @Roles('MANAGER')
    @ApiOperation({ summary: 'List all users (MANAGER only)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role?.name,
            created_at: u.created_at,
        }));
    }
}
