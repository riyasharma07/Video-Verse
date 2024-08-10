/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/db/video.entity';

@Injectable()
export class VideoRepository {
  constructor(
    @InjectRepository(Video)
    private readonly repository: Repository<Video>,
  ) {}

  // Save a video
  async save(video: Video): Promise<Video> {
    return await this.repository.save(video);
  }

  // Find a video by ID
  async getById(id: number): Promise<Video | null> {
    return await this.repository.findOne({ where: { id } });
  }  

  // Update a video record
  async updateVideo(video: Video): Promise<Video> {
    return await this.repository.save(video);  // save will update if the entity exists
  }

  // Delete a video record (if needed)
  async deleteVideo(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
