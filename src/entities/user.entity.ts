import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ name: 'role_id' })
    role_id: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
