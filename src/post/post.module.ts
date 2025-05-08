import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostRepository } from './repository/post.repository';
import { PostController } from './controller/post.controller';
import { CommentRepository } from '../comment/repository/comment.repository';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PostRepository, CommentRepository],
})
export class PostModule {}
