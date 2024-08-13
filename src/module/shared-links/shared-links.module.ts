/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedLinksController } from './controller/shared-links.controller';
import { SharedLinksService } from './service/shared-links.service';
import { SharedLink } from '../../db/links.entity';
import { SharedLinksRepository } from './repository/shared-links.repository';
import { Video } from '../../db/video.entity';
import { VideoRepository } from '../video/repository/video.repository';


@Module({
  imports: [TypeOrmModule.forFeature([SharedLink, Video])],
  providers: [SharedLinksService, SharedLinksRepository, VideoRepository],
  controllers: [SharedLinksController],
})
export class SharedLinkModule {}
