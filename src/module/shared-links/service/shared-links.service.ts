/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoRepository } from '../../video/repository/video.repository';
import { SharedLink } from '../../../db/links.entity';
import { SharedLinksRepository } from '../repository/shared-links.repository';

@Injectable()
export class SharedLinksService {
  constructor(
    @InjectRepository(SharedLink)
    private readonly sharedLinkRepository: SharedLinksRepository,
    private readonly videoRepository: VideoRepository,
  ) {}

  async generateSharedLink(videoId: number, expiresIn: number): Promise<SharedLink> {
    const video = await this.videoRepository.getById(videoId);
    if (!video) {
      throw new BadRequestException('Video not found');
    }

    const token = uuidv4();
    const expiryDate = new Date(Date.now() + expiresIn);

    const sharedLink = new SharedLink();
    sharedLink.token = token;
    sharedLink.video = video;
    sharedLink.expiresAt = expiryDate;

    return this.sharedLinkRepository.save(sharedLink);
  }

  async getByToken(token: string): Promise<SharedLink | null> {
    return await this.sharedLinkRepository.getByToken(token );
  }
}
