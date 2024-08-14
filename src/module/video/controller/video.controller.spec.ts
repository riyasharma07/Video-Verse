/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from '../service/video.service';
import { VideoRepository } from '../repository/video.repository';

const mockVideoService = {
  uploadVideo: jest.fn(),
  trimVideo: jest.fn(),
  mergeVideos: jest.fn(),
};

const mockVideoRepository = {
  find: jest.fn(),
  save: jest.fn(),
  getById: jest.fn(),
  getByIds: jest.fn(),
  updateVideo: jest.fn(),
};

describe('VideoController', () => {
  let controller: VideoController;
  let videoService: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockVideoService,
        },
        {
          provide: VideoRepository,
          useValue: mockVideoRepository,
        },
      ],
    }).compile();

    controller = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(videoService).toBeDefined();
  });
});
