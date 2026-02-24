import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const ADMIN_EMAIL = 'manager@123.com';
        const ADMIN_PASSWORD = 'manager@123';

        const existing = await this.userRepository.findOne({
            where: { email: ADMIN_EMAIL },
        });

        if (existing) {
            this.logger.log(`Admin user already exists: ${ADMIN_EMAIL}`);
            return;
        }

        const managerRole = await this.roleRepository.findOne({
            where: { name: 'MANAGER' },
        });

        if (!managerRole) {
            this.logger.error('MANAGER role not found in DB. Please seed roles first.');
            return;
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const admin = this.userRepository.create({
            name: 'Admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role_id: managerRole.id,
        });

        await this.userRepository.save(admin);
        this.logger.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
    }
}
