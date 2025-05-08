import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../entity/post.entity';

export class PostResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  writer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static of(entity: Post) {
    const response = new PostResponse();
    response.id = entity.id;
    response.title = entity.title;
    response.content = entity.content;
    response.writer = entity.writer;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;

    return response;
  }
}
