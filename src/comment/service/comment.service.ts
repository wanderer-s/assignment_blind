import { CommentRepository } from '../repository/comment.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCommentRequest,
  FindCommentRequest,
} from '../dto/comment.request.dto';
import {
  CommentCursorResponse,
  CommentResponse,
} from '../dto/comment.response.dto';
import { KeywordService } from '../../keyword/service/keyword.service';
import { Comment } from '../entity/comment.entity';
import { PostService } from '../../post/service/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly keywordService: KeywordService,
    private readonly postService: PostService,
  ) {}

  async addComment(id: number, param: CreateCommentRequest) {
    const post = await this.postService.getOne(id);

    const comment = Comment.create({ ...param, postId: post.id });
    await this.commentRepository.save(comment);
    this.keywordService
      .addIncludesKeywords(param.content, 'COMMENT')
      .catch((err) => console.log(`댓글 알람 queue err: ${err}`));
  }

  async addReply(
    postId: number,
    commentId: number,
    param: CreateCommentRequest,
  ) {
    const comment = await this.commentRepository.findParentOne(
      postId,
      commentId,
    );

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다');
    }

    comment.addReply(param);

    await this.commentRepository.save(comment);
    this.keywordService
      .addIncludesKeywords(param.content, 'COMMENT')
      .catch((err) => console.log(`대댓글 알람 queue err: ${err}`));
  }

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
