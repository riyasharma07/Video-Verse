/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/dbService';
import { VideoModule } from './module/video/video.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: './src/db/VideoVerseDB.sqlite',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        // migrations: ['./src/db/migrations/*.ts'],
        logging: true,
      }),
      dataSourceFactory: async () => AppDataSource.initialize(),
    }),
    VideoModule,
  ],
})
export class AppModule {}
