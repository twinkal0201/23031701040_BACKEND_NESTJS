import { User } from './user.entity';
export declare class Role {
    id: number;
    name: 'MANAGER' | 'SUPPORT' | 'USER';
    users: User[];
}
