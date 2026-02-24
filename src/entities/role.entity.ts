import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['MANAGER', 'SUPPORT', 'USER'], unique: true })
  name: 'MANAGER' | 'SUPPORT' | 'USER';

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
