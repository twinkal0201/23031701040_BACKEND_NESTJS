import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CommentsModule } from './comments/comments.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Tinkal$$6',
      database: 'STM_DB',
      entities: [Role, User, Ticket, TicketComment, TicketStatusLog],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Role]),
    AuthModule,
    UsersModule,
    TicketsModule,
    CommentsModule,
  ],
  providers: [SeederService],
})
export class AppModule { }
