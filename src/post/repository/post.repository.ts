import { DataSource, Repository } from 'typeorm';
import { Post } from '../entity/post.entity';
import { Injectable } from '@nestjs/common';
import { FindPostRequest, KeywordType } from '../dto/post.request.dto';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async findAll({ skip, limit, keywordType, keyword }: FindPostRequest) {
    const qb = this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.writer',
        'post.createdAt',
        'post.updatedAt',
      ])
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.replies', 'reply');

    if (keyword) {
      if (keywordType === KeywordType.WRITER) {
        qb.where('post.writer LIKE :keyword', { keyword: `%${keyword}%` });
      }

      if (keywordType === KeywordType.TITLE) {
        qb.where('post.title LIKE :keyword', { keyword: `%${keyword}%` });
      }
    }

    return qb
      .skip(skip)
      .take(limit)
      .orderBy('post.id', 'DESC')
      .getManyAndCount();
  }

  async findById(id: number): Promise<Post | null> {
    return this.findOne({ where: { id } });
  }
}
