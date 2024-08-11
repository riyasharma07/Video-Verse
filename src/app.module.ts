/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/dbService';
import { VideoModule } from './module/video/video.module';
import { Reflector } from '@nestjs/core';
import { AuthService } from './guards/auth.service';
import { ApiAuthGuard } from './guards/api-auth.guard';

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
  providers: [
    Reflector,
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: ApiAuthGuard,
    },
  ],
})
export class AppModule {}
