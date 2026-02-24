import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securepassword' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: ['MANAGER', 'SUPPORT', 'USER'], example: 'SUPPORT' })
    @IsEnum(['MANAGER', 'SUPPORT', 'USER'])
    role: 'MANAGER' | 'SUPPORT' | 'USER';
}
