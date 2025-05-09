import { Module } from '@nestjs/common';
import { KeywordRepository } from './repository/keyword.repository';
import { KeywordService } from './service/keyword.service';
import { QueueModule } from '../queue/queue.module';
import { KeywordQueueProcessor } from './queue/keyword.processor';

@Module({
  imports: [QueueModule],
  providers: [KeywordRepository, KeywordService, KeywordQueueProcessor],
  exports: [KeywordService],
})
export class KeywordModule {}
