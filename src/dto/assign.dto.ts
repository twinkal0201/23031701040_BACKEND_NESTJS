import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDto {
    @ApiProperty({ example: 2, description: 'User ID of the support/manager to assign' })
    @IsInt()
    @IsPositive()
    assigned_to: number;
}
