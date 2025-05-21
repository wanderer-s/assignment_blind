import { PostRepository } from '../repository/post.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostListResponse, PostResponse } from '../dto/post.response.dto';
import { PaginationResponse } from '../../global/dto/response.dto';
import { CreatePostRequest, FindPostRequest, UpdatePostRequest } from '../dto/post.request.dto';
import { Post } from '../entity/post.entity';
import * as bcrypt from 'bcrypt';
import { KeywordService } from '../../keyword/service/keyword.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly keywordService: KeywordService,
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
    this.keywordService
      .addIncludesKeywords(param.content, 'POST')
      .catch((err) => console.log(`게시글 알람 queue err: ${err}`));
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
}
