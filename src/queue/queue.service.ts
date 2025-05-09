import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobMap } from './job.type';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('redisQueue') private readonly redisQueue: Queue) {}

  async addJob<T extends keyof JobMap>(jobName: T, data: JobMap[T]) {
    await this.redisQueue.add(jobName, data);
  }
}
