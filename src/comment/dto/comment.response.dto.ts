import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../entity/comment.entity';

export class ChildCommentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  writer: string;

  @ApiProperty()
  createAt: Date;

  static of(entity: Comment) {
    const response = new ChildCommentResponse();
    response.id = entity.id;
    response.content = entity.content;
    response.writer = entity.writer;
    response.createAt = entity.createdAt;

    return response;
  }
}

export class CommentResponse extends ChildCommentResponse {
  @ApiProperty()
  childComments: ChildCommentResponse[];

  static from(entity: Comment) {
    const response = new CommentResponse();
    response.id = entity.id;
    response.content = entity.content;
    response.writer = entity.writer;
    response.createAt = entity.createdAt;
    response.childComments =
      entity.replies?.map((reply) => ChildCommentResponse.of(reply)) ?? [];

    return response;
  }
}

export class CommentCursorResponse {
  @ApiProperty()
  comments: CommentResponse[];

  @ApiProperty()
  hasMore: boolean;

  @ApiProperty({ nullable: true })
  nextCursor: number | null;

  constructor(
    commentResponses: CommentResponse[],
    hasMore: boolean,
    nextCursor: number | null,
  ) {
    this.comments = commentResponses;
    this.hasMore = hasMore;
    this.nextCursor = nextCursor ?? null;
  }
}
