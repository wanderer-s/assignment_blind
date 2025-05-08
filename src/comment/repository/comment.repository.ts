import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { FindCommentRequest } from '../dto/comment.request.dto';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async findParentOne(postId: number, commentId: number) {
    return this.findOne({
      relations: {
        replies: true,
      },
      where: {
        post: {
          id: postId,
        },
        id: commentId,
        parentId: IsNull(),
      },
    });
  }

  async findAll(postId: number, { limit, beforeId }: FindCommentRequest) {
    const qb = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.replies', 'reply')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parentId is null')
      .orderBy('comment.id', 'DESC');

    if (beforeId) {
      qb.andWhere('comment.id < :beforeId', { beforeId });
    }

    return await qb.take(limit + 1).getMany();
  }
}
