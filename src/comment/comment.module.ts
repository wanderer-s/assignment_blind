import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';
import { CommentRepository } from './repository/comment.repository';
import { CommentService } from './service/comment.service';
import { KeywordModule } from '../keyword/keyword.module';

@Module({
  imports: [KeywordModule],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
})
export class CommentModule {}
