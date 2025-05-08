import { Post } from '../../entity/post.entity';
import { Comment } from '../../../comment/entity/comment.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('Post Entity Test', () => {
  it('static create - post entity 생성', () => {
    const post = Post.create({
      title: 'title',
      content: 'content',
      hashedPassword: 'hashedPassword',
      writer: 'writer',
    });

    expect(post).toBeInstanceOf(Post);
  });

  it('update', () => {
    const post = Post.create({
      title: 'title',
      content: 'content',
      hashedPassword: 'hashedPassword',
      writer: 'writer',
    });

    expect(post.title).toBe('title');
    expect(post.content).toBe('content');

    post.update({
      content: 'newContent',
    });

    expect(post.title).toBe('title');
    expect(post.content).toBe('newContent');
  });

  describe('commentCount - 게시글에 속한 댓글 갯수 (대댓글 포함)', () => {
    const post = Post.create({
      title: 'title',
      content: 'content',
      hashedPassword: 'hashedPassword',
      writer: 'writer',
    });

    it('comment를 relation을 통해 불러오지 않아 값이 undefined 경우 예외 처리', () => {
      expect(() => post.commentsCount).toThrow(InternalServerErrorException);
    });

    it('게시글에 댓글이 추가되면 댓글 갯수를 반환(대댓글 포함)', () => {
      post.comments = [
        Comment.create({ content: 'content', writer: 'writer' }),
      ];

      const comment = post.comments[0];
      comment.replies = [];

      expect(post.commentsCount).toBe(1);

      comment.addReply({ content: 'comment 2', writer: 'writer 2' });
      comment.addReply({ content: 'comment 3', writer: 'writer 3' });

      expect(post.commentsCount).toBe(3);
    });
  });
});
