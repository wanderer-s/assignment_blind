import { ContentsType } from '../service/keyword.service';

export class KeywordAlarmJob {
  constructor(
    public keywords: Record<string, string[]>,
    public contentsType: ContentsType,
  ) {}
}
