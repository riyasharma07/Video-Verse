/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Video } from '../../../db/video.entity';
import { CreateVideoDto } from '../dto/upload-video.dto';
import { VideoRepository } from '../repository/video.repository';
import * as path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { EntityManager } from 'typeorm';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly videoRepository: VideoRepository,
  ) {
    console.log('VideoRepository injected:', !!this.videoRepository);
  }

    // Existing method to get video duration
    private async getVideoDuration(filePath: string): Promise<number> {
      try {
        console.log('Retrieving duration for:', filePath);
        const duration = await getVideoDurationInSeconds(filePath);
        console.log('Video duration:', duration, 'seconds');
        return Math.floor(duration);
      } catch (error) {
        console.error('Failed to retrieve video duration:', error.message || error);
        throw new Error('Error retrieving video duration');
      }
    }

    async uploadVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<Video> {
    const video = new Video();
    video.title = createVideoDto.title;
    video.description = createVideoDto.description;
    video.filename = file.filename;

    const normalizedPath = path.normalize(file.path);
    video.path = normalizedPath;

    video.size = file.size;
    video.duration = await this.getVideoDuration(normalizedPath);

    return this.videoRepository.save(video);
  }

  // New method to trim a video
async trimVideo(id: number, startTime: number, endTime: number): Promise<Video> {
  const video = await this.videoRepository.getById(id);

  if (!video) {
    throw new BadRequestException('Video not found');
  }

  // Get video duration
  const videoDuration = await this.getVideoDuration(video.path);
  console.log(`Video duration: ${videoDuration} seconds`);  // Debug log

  // Validate startTime and endTime
  if (startTime < 0 || startTime >= videoDuration) {
    throw new BadRequestException(`Invalid start time: ${startTime}. It must be between 0 and ${videoDuration}`);
  }

  if (endTime <= startTime || endTime > videoDuration) {
    throw new BadRequestException(`Invalid end time: ${endTime}. It must be between ${startTime} and ${videoDuration}`);
  }

  const inputFilePath = video.path;
  const outputFilePath = path.join(path.dirname(inputFilePath), `trimmed-${path.basename(inputFilePath)}`);

  await this.performTrim(inputFilePath, outputFilePath, startTime, endTime);

  const trimmedDuration = await this.getVideoDuration(outputFilePath);
  video.path = outputFilePath;
  video.duration = trimmedDuration;
  const stats = await fs.promises.stat(outputFilePath);
  video.size = stats.size;

  return this.videoRepository.updateVideo(video);
}

//TO-DO - implement try catch block
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

  async mergeVideos(videoIds: number[]): Promise<Video> {
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      throw new BadRequestException('At least one video ID is required');
    }

    const videos = await this.videoRepository.getByIds(videoIds);

    if (videos.length !== videoIds.length) {
      const foundIds = videos.map(video => video.id);
      const notFoundIds = videoIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Videos with IDs ${notFoundIds.join(', ')} not found`);
    }

    if (videos.length === 0) {
      throw new Error('No videos found with the provided IDs');
    }

    const outputFilePath = path.join(path.dirname(videos[0].path), `merged-${Date.now()}.mp4`);
    const outputFilename = `merged-${Date.now()}.mp4`; // Create a filename for the merged video

    await this.performMerge(videos.map(video => video.path), outputFilePath);

    const mergedVideo = new Video();
    mergedVideo.title = 'Merged Video';
    mergedVideo.filename = outputFilename;
    mergedVideo.path = outputFilePath;
    mergedVideo.duration = await this.getVideoDuration(outputFilePath);

    const stats = await fs.promises.stat(outputFilePath);
    mergedVideo.size = stats.size;

    return this.videoRepository.save(mergedVideo);
  }

  private async performMerge(inputFilePaths: string[], outputFilePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const ffmpegCommand = ffmpeg();

      inputFilePaths.forEach(filePath => {
        ffmpegCommand.input(filePath);
      });

      ffmpegCommand
        .on('end', () => {
          console.log('Merging finished successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error during merging:', err);
          reject(err);
        })
        .mergeToFile(outputFilePath);
    });
  }

  async generateShareableLink(videoId: number, expiresIn: number): Promise<Video> {
    const video = await this.videoRepository.getById(videoId);
    if (!video) {
      throw new BadRequestException('Video not found');
    }

    video.shareToken = uuidv4();
    video.shareExpiresAt = new Date(Date.now() + expiresIn);

    return this.videoRepository.save(video);
  }

  async getVideoByToken(token: string): Promise<Video> {
    const video = await this.videoRepository.getByToken(token);
    if (!video || new Date() > video.shareExpiresAt) {
      throw new BadRequestException('Link is invalid or has expired');
    }

    return video;
  }
}