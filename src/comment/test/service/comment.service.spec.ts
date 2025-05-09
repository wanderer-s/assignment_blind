import {
  instance,
  lowerThanOrEqual,
  mock,
  when,
} from '@johanblumenberg/ts-mockito';
import { CommentRepository } from '../../repository/comment.repository';
import { CommentService } from '../../service/comment.service';
import { Comment, CreateCommentParam } from '../../entity/comment.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { KeywordService } from '../../../keyword/service/keyword.service';

describe('Comment Service ', () => {
  const commentRepository = mock(CommentRepository);
  const keywordService = mock(KeywordService)

  const commentService = new CommentService(instance(commentRepository), instance(keywordService));

  it('should comment service be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('addReply - 대댓글 작성', () => {
    when(
      commentRepository.findParentOne(lowerThanOrEqual(1), lowerThanOrEqual(1)),
    ).thenResolve(null);

    const commentParam: CreateCommentParam = {
      content: 'content',
      writer: 'writer',
    };
    const comment = Comment.create(commentParam);
    when(commentRepository.findParentOne(2, 2)).thenResolve(comment);

    it('대댓글을 추가 할 comment를 찾을 수 없는 경우 예외처리', async () => {
      await expect(commentService.addReply(1, 1, commentParam)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('하위 대댓글 정보인 replies 를 relation 으로 불러오지 않은 경우 예외 처리', async () => {
      await expect(commentService.addReply(2, 2, commentParam)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
