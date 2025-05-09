import { Inject, Injectable } from '@nestjs/common';
import { KeywordRepository } from '../repository/keyword.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { QueueService } from '../../queue/queue.service';
import { KeywordAlarmJob } from '../queue/keyword-alarm.job';

export type ContentsType = 'POST' | 'COMMENT';

@Injectable()
export class KeywordService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly keywordRepository: KeywordRepository,
    private readonly queueService: QueueService,
  ) {}

  private async findAll() {
    const keywordsCache =
      await this.cacheManager.get<Record<string, string[]>>('keyword');

    if (keywordsCache) {
      return keywordsCache;
    }

    const keywords = await this.keywordRepository.find();

    const uniqueKeywords = keywords?.reduce(
      (obj: Record<string, string[]>, { keyword, writer }) => {
        if (obj[keyword]) {
          obj[keyword].push(writer);
        } else {
          obj[keyword] = [writer];
        }

        return obj;
      },
      {},
    );

    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // 하루에 한번씩 초기화
    await this.cacheManager.set(
      'keyword',
      uniqueKeywords,
      endOfDay.getTime() - now.getTime(),
    );

    return uniqueKeywords;
  }

  private async checkIncludeKeywords(content: string) {
    const keywords = await this.findAll();

    return Object.keys(keywords).reduce(
      (obj: Record<string, string[]>, keyword) => {
        if (content.includes(keyword)) {
          obj[keyword] = keywords[keyword];
        }
        return obj;
      },
      {},
    );
  }

  private async addSendAlarmQueue(
    keywords: Record<string, string[]>,
    contentType: ContentsType,
  ) {
    await this.queueService.addJob(
      'keyword-alarm',
      new KeywordAlarmJob(keywords, contentType),
    );
  }

  async addIncludesKeywords(content: string, contentType: ContentsType) {
    const includesKeywordData = await this.checkIncludeKeywords(content);
    await this.addSendAlarmQueue(includesKeywordData, contentType);
  }
}
