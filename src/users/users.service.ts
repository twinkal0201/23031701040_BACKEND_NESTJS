import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async create(dto: CreateUserDto): Promise<User> {
        // Check for duplicate email
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        // Find role
        const role = await this.roleRepository.findOne({ where: { name: dto.role } });
        if (!role) {
            throw new BadRequestException(`Role ${dto.role} not found`);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role_id: role.id,
        });

        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['role'] });
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
        if (!user) throw new NotFoundException(`User ${id} not found`);
        return user;
    }
}
