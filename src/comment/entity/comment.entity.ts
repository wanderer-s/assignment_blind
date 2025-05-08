import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RootEntity } from '../../global/entity/root.entity';
import { Post } from '../../post/entity/post.entity';
import { InternalServerErrorException } from '@nestjs/common';

export type CreateCommentParam = {
  content: string;
  writer: string;
  postId?: number;
};

@Entity()
export class Comment extends RootEntity {
  @Column()
  content: string;

  @Column()
  writer: string;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment | null;

  @Column({ nullable: true })
  parentId: number | null;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: ['insert'],
  })
  replies: Comment[];

  static create({ content, writer, postId }: CreateCommentParam) {
    const comment = new Comment();
    comment.content = content;
    comment.writer = writer;
    if (postId) {
      comment.postId = postId;
    }

    return comment;
  }

  addReply(param: CreateCommentParam) {
    if (typeof this.replies === 'undefined') {
      throw new InternalServerErrorException();
    }
    const comment = Comment.create(param);
    comment.postId = this.postId;
    this.replies.push(comment);
  }

  @AfterLoad()
  sortedReplies() {
    if (this.replies?.length) {
      this.replies.sort((a, b) => a.id - b.id);
    }
  }
}
