import { Comment } from '../../entity/comment.entity';

describe('Comment Entity Test', () => {
  it('static create - comment entity 생성', () => {
    const comment = Comment.create({ content: 'content', writer: 'writer' });

    expect(comment).toBeInstanceOf(Comment);
  });

  it('addReply - 대댓글 생성', () => {
    const comment = Comment.create({ content: 'content', writer: 'writer' });
    comment.replies = [];

    comment.addReply({ content: 'second content', writer: 'writer' });

    expect(comment.replies.length).toBe(1);
  });
});
