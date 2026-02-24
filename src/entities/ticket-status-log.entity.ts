import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity('ticket_status_logs')
export class TicketStatusLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ticket_id' })
    ticket_id: number;

    @Column({
        name: 'old_status',
        type: 'enum',
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    })
    old_status: string;

    @Column({
        name: 'new_status',
        type: 'enum',
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    })
    new_status: string;

    @Column({ name: 'changed_by', nullable: true })
    changed_by: number | null;

    @CreateDateColumn({ name: 'changed_at' })
    changed_at: Date;

    @ManyToOne(() => Ticket, (t) => t.statusLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'changed_by' })
    changedBy: User | null;
}
