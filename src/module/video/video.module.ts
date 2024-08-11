/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../../db/video.entity';
import { VideoRepository } from './repository/video.repository';
import { VideoService } from './service/video.service';
import { VideoController } from './controller/video.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  providers: [VideoRepository, VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
