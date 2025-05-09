import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobMap } from '../../queue/job.type';
import { KeywordAlarmJob } from './keyword-alarm.job';

@Processor('redisQueue')
export class KeywordQueueProcessor extends WorkerHost {
  async process(job: Job) {
    console.log(`작업 처리 시작 - Job ID: ${job.id}, Job name: ${job.name}`)
    try {
      switch (job.name as keyof JobMap) {
        case 'keyword-alarm':
          this.sendAlarm(job.data);
          break;
        default:
          console.log('지정되지 않은 Job 입니다');
      }

      console.log(`작업 처리 완료 - Job ID: ${job.id}, Job name: ${job.name}`);
    } catch (err) {
      console.log(
        `작업 처리 실패 - Job ID: ${job.id}, Job name: ${job.name}, err: ${err.stack}`,
      );
      throw err;
    }
  }

  private sendAlarm(keywordAlarmJob: KeywordAlarmJob) {
    for (const [keyword, writers] of Object.entries(keywordAlarmJob.keywords)) {
      for (const writer of writers) {
        console.log(
          `${writer}님 지정한 키워드(${keyword})로 ${keywordAlarmJob.contentsType === 'POST' ? '게시글' : '댓글'}이 등록되었습니다`,
        );
      }
    }
  }
}
