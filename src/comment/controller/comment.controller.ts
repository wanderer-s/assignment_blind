import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import {
  CreateCommentRequest,
  FindCommentRequest,
} from '../dto/comment.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 조회' })
  @Get()
  async findAll(
    @Param('postId') postId: number,
    @Query() query: FindCommentRequest,
  ) {
    return this.commentService.findAll(postId, query);
  }

  @ApiOperation({ summary: '게시글에 댓글 달기' })
  @Post()
  async addComment(
    @Param('postId') postId: number,
    @Body() requestParam: CreateCommentRequest,
  ) {
    return this.commentService.addComment(postId, requestParam);
  }

  @ApiOperation({ summary: '대댓글 작성' })
  @Post(':id/reply')
  async addReply(
    @Param('postId') postId: number,
    @Param('id') commentId: number,
    @Body() requestParam: CreateCommentRequest,
  ) {
    return this.commentService.addReply(postId, commentId, requestParam);
  }
}
