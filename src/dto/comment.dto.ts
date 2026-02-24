import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
    @ApiProperty({ example: 'Looking into this issue now.' })
    @IsString()
    @MinLength(1)
    comment: string;
}
