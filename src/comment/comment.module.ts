import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';
import { CommentRepository } from './repository/comment.repository';
import { CommentService } from './service/comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
})
export class CommentModule {}
