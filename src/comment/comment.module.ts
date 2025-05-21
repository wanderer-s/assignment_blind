import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';
import { CommentRepository } from './repository/comment.repository';
import { CommentService } from './service/comment.service';
import { KeywordModule } from '../keyword/keyword.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [KeywordModule, PostModule],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
})
export class CommentModule {}
