import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
    @ApiProperty({ enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] })
    @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
