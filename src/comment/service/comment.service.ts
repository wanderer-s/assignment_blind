import { CommentRepository } from '../repository/comment.repository';
import { Injectable } from '@nestjs/common';
import { FindCommentRequest } from '../dto/comment.request.dto';
import { CommentCursorResponse, CommentResponse } from '../dto/comment.response.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async findAll(postId: number, param: FindCommentRequest) {
    const comments = await this.commentRepository.findAll(postId, param);

    const hasMore = comments.length === param.limit + 1;

    const commentsToReturn = hasMore
      ? comments.slice(0, param.limit)
      : comments;
    commentsToReturn.reverse();

    const nextCursor: number | null = commentsToReturn[0]?.id ?? null;

    const commentResponse = commentsToReturn.map((comment) =>
      CommentResponse.from(comment),
    );

    return new CommentCursorResponse(commentResponse, hasMore, nextCursor);
  }
}
