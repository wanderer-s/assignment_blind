import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { RootEntity } from '../../global/entity/root.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { InternalServerErrorException } from '@nestjs/common';

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

  @Column({ type: 'text' })
  content: string;

  @Column()
  writer: string;

  @Column({ name: 'password' })
  hashedPassword: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ['insert', 'update', 'remove'],
  })
  comments?: Comment[];

  static create(param: CreatePostParam) {
    const post = new Post();
    post.title = param.title;
    post.content = param.content;
    post.writer = param.writer;
    post.hashedPassword = param.hashedPassword;

    return post;
  }

  get commentsCount() {
    if (typeof this.comments === 'undefined') {
      throw new InternalServerErrorException();
    }

    return this.comments.reduce((total, comment) => {
      if (typeof comment.replies === 'undefined') {
        throw new InternalServerErrorException();
      }
      return total + 1 + comment.replies.length;
    }, 0);
  }

  update(param: Partial<Omit<CreatePostParam, 'hashedPassword' | 'writer'>>) {
    this.title = param.title ?? this.title;
    this.content = param.content ?? this.content;
  }
}
