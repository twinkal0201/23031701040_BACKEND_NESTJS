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

@Entity('ticket_comments')
export class TicketComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ticket_id', nullable: true })
    ticket_id: number;

    @Column({ name: 'user_id', nullable: true })
    user_id: number;

    @Column({ type: 'text' })
    comment: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @ManyToOne(() => Ticket, (t) => t.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
