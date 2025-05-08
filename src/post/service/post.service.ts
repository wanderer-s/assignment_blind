import { PostRepository } from '../repository/post.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostListResponse, PostResponse } from '../dto/post.response.dto';
import { PaginationResponse } from '../../global/dto/response.dto';
import {
  CreatePostRequest,
  FindPostRequest,
  UpdatePostRequest,
} from '../dto/post.request.dto';
import { Post } from '../entity/post.entity';
import * as bcrypt from 'bcrypt';
import { CreateCommentRequest } from '../../comment/dto/comment.request.dto';
import { CommentRepository } from '../../comment/repository/comment.repository';
import { Comment } from '../../comment/entity/comment.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async findAll(param: FindPostRequest) {
    const [posts, count] = await this.postRepository.findAll(param);

    const postsResponse = posts.map((post) => PostListResponse.of(post));

    return new PaginationResponse(
      postsResponse,
      count,
      param.page,
      param.limit,
    );
  }

  private async getOneById(id: number) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다');
    }

    return post;
  }

  async getOne(id: number) {
    const post = await this.getOneById(id);

    return PostResponse.of(post);
  }

  async create(param: CreatePostRequest) {
    const hashedPassword = await bcrypt.hash(param.password, 10);

    const post = Post.create({
      title: param.title,
      content: param.content,
      writer: param.writer,
      hashedPassword,
    });

    await this.postRepository.save(post);
  }

  async update(id: number, param: UpdatePostRequest) {
    const post = await this.getOneById(id);

    if (!(await bcrypt.compare(param.password, post.hashedPassword))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }

    post.update({
      title: param.title,
      content: param.content,
    });

    await this.postRepository.save(post);
  }

  async delete(id: number, password: string) {
    const post = await this.getOneById(id);

    if (!(await bcrypt.compare(password, post.hashedPassword))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }

    await this.postRepository.remove(post);
  }

  async addComment(id: number, param: CreateCommentRequest) {
    const post = await this.getOneById(id);

    const comment = Comment.create({ ...param, postId: post.id });
    await this.commentRepository.save(comment);
  }
}
