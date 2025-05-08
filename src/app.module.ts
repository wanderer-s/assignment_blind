import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeORMConfig } from './config/typeorm.config';
import { CommentModule } from './comment/comment.module';
import { RouterModule } from '@nestjs/core';

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
