/* eslint-disable prettier/prettier */
import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Express } from 'express';
import { CreateVideoDto } from '../dto/upload-video.dto';
import { VideoService } from '../service/video.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('videos')
@ApiBearerAuth()
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
      fileSize: 25 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('video/')) {
        cb(new BadRequestException('Only video files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  @ApiOperation({ summary: 'Upload a video file with additional metadata' })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file or request.' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.videoService.uploadVideo(file, createVideoDto);
  }

  @Post(':id/trim')
  @ApiOperation({ summary: 'Trim an existing video from a specified start time to an end time.' })
  @ApiResponse({ status: 200, description: 'Video trimmed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid start or end time.' })
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

  @Post('merge')
  @ApiOperation({ summary: 'Merge multiple video clips into a single video file.' })
  @ApiResponse({ status: 200, description: 'Videos merged successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async mergeVideos(
    @Body('videoIds') videoIds: number[],
  ) {
    if (!Array.isArray(videoIds)) {
      throw new BadRequestException('Invalid input: videoIds should be an array');
    }

    return this.videoService.mergeVideos(videoIds);
  }
}
