import { Column, Entity } from 'typeorm';
import { RootEntity } from '../../global/entity/root.entity';

type CreatePostParam = {
  title: string;
  content: string;
  writer: string;
  hashedPassword: string;
};

@Entity()
export class Post extends RootEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  writer: string;

  @Column({ name: 'password' })
  hashedPassword: string;

  static create(param: CreatePostParam) {
    const post = new Post();
    post.title = param.title;
    post.content = param.content;
    post.writer = param.writer;
    post.hashedPassword = param.hashedPassword;

    return post;
  }

  update(param: Partial<Omit<CreatePostParam, 'hashedPassword' | 'writer'>>) {
    this.title = param.title ?? this.title;
    this.content = param.content ?? this.content;
  }
}
