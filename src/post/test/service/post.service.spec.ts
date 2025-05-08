import { PostRepository } from '../../repository/post.repository';
import { deepEqual, instance, mock, when } from '@johanblumenberg/ts-mockito';
import { PostService } from '../../service/post.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Post } from '../../entity/post.entity';
import { PostResponse } from '../../dto/post.response.dto';
import * as bcrypt from 'bcrypt';
import { FindPostRequest } from '../../dto/post.request.dto';
import { CommentRepository } from '../../../comment/repository/comment.repository';

describe('Post Service Test', () => {
  const postRepository = mock(PostRepository);
  const commentRepository = mock(CommentRepository);

  const postService = new PostService(
    instance(postRepository),
    instance(commentRepository),
  );

  it('should post service defined', () => {
    expect(postService).toBeDefined();
  });

  when(postRepository.findById(1)).thenResolve(null);

  const post = Post.create({
    title: 'title',
    content: 'content',
    writer: 'writer',
    hashedPassword: bcrypt.hashSync('hashedPassword', 10),
  });
  when(postRepository.findById(2)).thenResolve(post);

  describe('findAll - pagination response 형태로 목록 반환', () => {
    it('조회값이 없는경우 면 빈 배열 반환', async () => {
      when(
        postRepository.findAll(
          deepEqual({ page: 10, limit: 10 } as FindPostRequest),
        ),
      ).thenResolve([[], 0]);

      const result = await postService.findAll({
        page: 10,
        limit: 10,
      } as FindPostRequest);

      expect(result.count).toBe(0);
      expect(result.totalCount).toBe(0);
      expect(result.items).toEqual([]);
    });
    it('조회값이 있는경우 pagination response 형태로 반환', async () => {
      post.comments = [];
      when(
        postRepository.findAll(
          deepEqual({ page: 1, limit: 10 } as FindPostRequest),
        ),
      ).thenResolve([[post], 1]);

      const result = await postService.findAll({
        page: 1,
        limit: 10,
      } as FindPostRequest);

      expect(result.count).toBe(1);
      expect(result.totalCount).toBe(1);
      expect(result.items[0].title).toBe(post.title);
    });
  });

  describe('getOne - 주어진 id로 PostResponse 반환', () => {
    it('주어진 id로 post 를 조회할 수 없는 경우 예외 처리', async () => {
      await expect(postService.getOne(1)).rejects.toThrow(NotFoundException);
    });

    it('주어진 id로 post를 조회하여 PostResponse로 전환하여 반환', async () => {
      when(postRepository.findById(2)).thenResolve(post);

      const postResponse = await postService.getOne(2);

      expect(postResponse).toBeInstanceOf(PostResponse);
      expect(postResponse.title).toBe(post.title);
      expect(postResponse.content).toBe(post.content);
      expect(postResponse.writer).toBe(post.writer);
    });
  });

  describe('update - title 또는 content 수정', () => {
    it('주어진 id로 post 를 조회할 수 없는 경우 예외 처리', async () => {
      await expect(
        postService.update(1, {
          title: 'newTitle',
          password: 'hashedPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('입력한 비밀번호가 게시글의 비밀번호와 다른 경우 예외 처리', async () => {
      await expect(
        postService.update(2, {
          title: 'newTitle',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('입력한 값으로 수정', async () => {
      const post = Post.create({
        title: 'title',
        content: 'content',
        writer: 'writer',
        hashedPassword: bcrypt.hashSync('hashedPassword', 10),
      });

      when(postRepository.findById(3)).thenResolve(post);

      await postService.update(3, {
        content: 'new Content',
        password: 'hashedPassword',
      });

      expect(post.content).toBe('new Content');
    });
  });

  describe('delete - 게시글 삭제', () => {
    it('주어진 id로 post 를 조회할 수 없는 경우 예외 처리', async () => {
      await expect(postService.delete(1, 'hashedPassword')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('입력한 비밀번호가 게시글의 비밀번호와 다른 경우 예외 처리', async () => {
      await expect(postService.delete(2, 'wrongPassword')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('addComment - 게시글에 댓글 작성', () => {
    const post = Post.create({
      title: 'title',
      content: 'content',
      writer: 'writer',
      hashedPassword: bcrypt.hashSync('hashedPassword', 10),
    });
    post.comments = [];

    it('주어진 id로 post 를 조회할 수 없는 경우 예외 처리', async () => {
      await expect(
        postService.addComment(1, {
          content: 'new Comment',
          writer: 'new Writer',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
