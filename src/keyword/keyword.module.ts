import { Module } from '@nestjs/common';
import { KeywordRepository } from './repository/keyword.repository';
import { KeywordService } from './service/keyword.service';

@Module({
  providers: [KeywordRepository, KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}
