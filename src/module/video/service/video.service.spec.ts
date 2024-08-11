/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from '../service/video.service';
import { VideoRepository } from '../repository/video.repository';
import { EntityManager } from 'typeorm';
import { Mocked } from 'jest-mock';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Video } from '../../../db/video.entity';
import fs from 'fs';


jest.mock('fs');
jest.mock('app-root-path', () => ({
  path: '../service',
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('VideoService', () => {
  let service: VideoService;
  let videoRepository: Mocked<VideoRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: VideoRepository,
          useValue: jest.mocked({
            save: jest.fn(),
            getById: jest.fn(),
            getByIds: jest.fn(),
            getByToken: jest.fn(),
            updateVideo: jest.fn(),
          }),
        },
        {
          provide: EntityManager,
          useValue: jest.mocked({
            query: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    videoRepository = module.get<VideoRepository>(VideoRepository) as Mocked<VideoRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if no video IDs are provided', async () => {
    await expect(service.mergeVideos([])).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if any of the video IDs are not found', async () => {
    videoRepository.getByIds.mockResolvedValue([new Video()]);

    await expect(service.mergeVideos([1, 2])).rejects.toThrow(BadRequestException);
  });

  it('should merge the videos successfully', async () => {
    const video1 = new Video();
    video1.id = 1;
    video1.path = 'video1.mp4';

    const video2 = new Video();
    video2.id = 2;
    video2.path = 'video2.mp4';

    videoRepository.getByIds.mockResolvedValue([video1, video2]);

    const fsStatMock = fs.promises.stat as jest.MockedFunction<typeof fs.promises.stat>;
    fsStatMock.mockResolvedValue({ size: 2000 } as fs.Stats);

    const mergedVideo = await service.mergeVideos([1, 2]);

    expect(videoRepository.getByIds).toHaveBeenCalledWith([1, 2]);
    expect(mergedVideo.path).toContain('merged-');
    expect(mergedVideo.duration).toBeDefined();
    expect(mergedVideo.size).toBe(2000);
  });

  it('should return the video if the token is valid and not expired', async () => {
    const video = new Video();
    video.shareToken = 'test-uuid';
    video.shareExpiresAt = new Date(Date.now() + 3600000);

    videoRepository.getByToken.mockResolvedValue(video);

    const result = await service.getVideoByToken('test-uuid');

    expect(videoRepository.getByToken).toHaveBeenCalledWith('test-uuid');
    expect(result).toBe(video);
  });

  it('should throw BadRequestException if the token is invalid or expired', async () => {
    videoRepository.getByToken.mockResolvedValue(null);

    await expect(service.getVideoByToken('invalid-token')).rejects.toThrow(BadRequestException);
  });
});
