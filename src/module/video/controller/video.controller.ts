/* eslint-disable prettier/prettier */
import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Express } from 'express'; // This is the correct import for Express types
import { CreateVideoDto } from '../dto/upload-video.dto';
import { VideoService } from '../service/video.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      }
    }),
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB limit
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('video/')) {
        cb(new BadRequestException('Only video files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.videoService.uploadVideo(file, createVideoDto);
  }

  // New endpoint for trimming a video
  @Post(':id/trim')
  async trimVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body('startTime') startTime: number,
    @Body('endTime') endTime: number,
  ) {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be less than end time');
    }

    return this.videoService.trimVideo(id, startTime, endTime);
  }
}
