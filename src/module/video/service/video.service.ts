/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/db/video.entity';
import { CreateVideoDto } from '../dto/upload-video.dto';
import { VideoRepository } from '../repository/video.repository';
import * as path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { EntityManager } from 'typeorm';
import * as fs from 'fs';  // Import the regular fs module
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly videoRepository: VideoRepository,
  ) {
    console.log('VideoRepository injected:', !!this.videoRepository);
  }

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

  // New method to trim a video
  async trimVideo(id: number, startTime: number, endTime: number): Promise<Video> {
    const query = `SELECT * FROM videos WHERE id = ${id}`;
    const result = await this.entityManager.query(query);
    const video = result.length ? result[0] : null;

    if (!video) {
      throw new Error('Video not found');
    }
  
    const inputFilePath = video.path;
    const outputFilePath = path.join(path.dirname(inputFilePath), `trimmed-${path.basename(inputFilePath)}`);
  
    await this.performTrim(inputFilePath, outputFilePath, startTime, endTime);
  
    // Update the video record with the new trimmed file details
    const trimmedDuration = await this.getVideoDuration(outputFilePath);
    video.path = outputFilePath;
    video.duration = trimmedDuration;
    const stats = await fs.promises.stat(outputFilePath);
    video.size = stats.size;
  
    return this.videoRepository.updateVideo(video);
  }  

  private async performTrim(inputFilePath: string, outputFilePath: string, startTime: number, endTime: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('Trimming video...');
  
      ffmpeg(inputFilePath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output(outputFilePath)
        .on('end', () => {
          console.log('Trimming finished successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error during trimming:', err);
          reject(err);
        })
        .run();
    });
  }
  
  // Existing method to get video duration
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