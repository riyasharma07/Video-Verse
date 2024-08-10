/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/db/video.entity';
import { VideoController } from './controller/video.controller';
import { VideoRepository } from './repository/video.repository';
import { VideoService } from './service/video.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
  exports: [VideoRepository],
})
export class VideoModule {}
