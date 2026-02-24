import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        if (loginDto.email.trim() === '' || loginDto.password.trim() === '') {
            throw new UnauthorizedException('Email and password are required');
        }
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['role'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        let isMatch = false;
        const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
        if (isHashed) {
            isMatch = await bcrypt.compare(loginDto.password, user.password);
        } else {
            isMatch = loginDto.password === user.password;
        }

        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token
        };
    }
}
