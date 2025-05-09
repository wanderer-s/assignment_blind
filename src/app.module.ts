import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeORMConfig } from './config/typeorm.config';
import { CommentModule } from './comment/comment.module';
import { RouterModule } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeywordModule } from './keyword/keyword.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getTypeORMConfig(configService);
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        return {
          stores: new Keyv({
            store: new KeyvRedis(host),
            ttl: 60 * 1000,
            namespace: 'cache',
          }),
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get<string>('QUEUE_HOST'),
            port: +configService.getOrThrow<string>('QUEUE_PORT'),
          },
        };
      },
    }),
    KeywordModule,
    PostModule,
    CommentModule,
    RouterModule.register([
      {
        path: 'post/:postId',
        module: CommentModule,
      },
    ]),
  ],
})
export class AppModule {}
