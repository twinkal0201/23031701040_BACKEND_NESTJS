import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
export declare class SeederService implements OnApplicationBootstrap {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    onApplicationBootstrap(): Promise<void>;
    private seedAdmin;
}
