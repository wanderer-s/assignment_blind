import { Post } from '../../entity/post.entity';

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
});
