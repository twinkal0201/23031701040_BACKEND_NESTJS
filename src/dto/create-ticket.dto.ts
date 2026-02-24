import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiProperty({ example: 'Login Issue', minLength: 5 })
    @IsString()
    @MinLength(5)
    title: string;

    @ApiProperty({ example: 'Unable to login with correct credentials.', minLength: 10 })
    @IsString()
    @MinLength(10)
    description: string;

    @ApiPropertyOptional({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
    @IsOptional()
    @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}
