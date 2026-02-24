import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentDto } from '../dto/comment.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('tickets/:id/comments')
    @Roles('MANAGER', 'SUPPORT', 'USER')
    @HttpCode(201)
    @ApiOperation({ summary: 'Add comment to ticket' })
    @ApiResponse({ status: 201, description: 'Comment added' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async addComment(
        @Param('id', ParseIntPipe) ticketId: number,
        @Body() dto: CommentDto,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.addComment(ticketId, dto, user);
    }

    @Get('tickets/:id/comments')
    @Roles('MANAGER', 'SUPPORT', 'USER')
    @ApiOperation({ summary: 'List comments for a ticket' })
    @ApiResponse({ status: 200, description: 'List of comments' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getComments(
        @Param('id', ParseIntPipe) ticketId: number,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.getComments(ticketId, user);
    }

    @Patch('comments/:id')
    @Roles('MANAGER', 'SUPPORT', 'USER')
    @ApiOperation({ summary: 'Edit comment (author or MANAGER)' })
    @ApiResponse({ status: 200, description: 'Comment updated' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async updateComment(
        @Param('id', ParseIntPipe) commentId: number,
        @Body() dto: CommentDto,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.updateComment(commentId, dto, user);
    }

    @Delete('comments/:id')
    @Roles('MANAGER', 'SUPPORT', 'USER')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete comment (author or MANAGER)' })
    @ApiResponse({ status: 204, description: 'Comment deleted' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async deleteComment(
        @Param('id', ParseIntPipe) commentId: number,
        @CurrentUser() user: any,
    ) {
        await this.commentsService.deleteComment(commentId, user);
    }
}
