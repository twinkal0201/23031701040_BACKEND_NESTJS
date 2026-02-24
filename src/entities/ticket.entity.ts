import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TicketComment } from './ticket-comment.entity';
import { TicketStatusLog } from './ticket-status-log.entity';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN',
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM',
    })
    priority: TicketPriority;

    @Column({ name: 'created_by' })
    created_by: number;

    @Column({ name: 'assigned_to', nullable: true })
    assigned_to: number | null;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignee: User | null;

    @OneToMany(() => TicketComment, (c) => c.ticket)
    comments: TicketComment[];

    @OneToMany(() => TicketStatusLog, (l) => l.ticket)
    statusLogs: TicketStatusLog[];
}
