/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/db/video.entity';
import { CreateVideoDto } from '../dto/upload-video.dto';
import { VideoRepository } from '../repository/video.repository';
import * as path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: VideoRepository,
  ) {}

  async uploadVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<Video> {
    const video = new Video();
    video.title = createVideoDto.title;
    video.description = createVideoDto.description;
    video.filename = file.filename;

    // Normalize the path to ensure it is compatible across platforms
    const normalizedPath = path.normalize(file.path);
    video.path = normalizedPath;

    video.size = file.size;
    video.duration = await this.getVideoDuration(normalizedPath);

    return this.videoRepository.save(video);
  }

  private async getVideoDuration(filePath: string): Promise<number> {
    try {
      console.log('Retrieving duration for:', filePath);
      const duration = await getVideoDurationInSeconds(filePath);
      console.log('Video duration:', duration, 'seconds');
      return Math.floor(duration); // Duration is already in seconds
    } catch (error) {
      console.error('Failed to retrieve video duration:', error.message || error);
      throw new Error('Error retrieving video duration');
    }
  }
}
