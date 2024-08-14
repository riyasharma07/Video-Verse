/* eslint-disable prettier/prettier */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { Video } from '../../src/db/video.entity';
import * as fs from 'fs';
import * as path from 'path';  // Import the path module

describe('VideoController (e2e)', () => {
  let app: INestApplication;
  let videoRepository: Repository<Video>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    videoRepository = moduleFixture.get<Repository<Video>>(getRepositoryToken(Video));
  });

  afterAll(async () => {
    await app.close();
  });

  it.only('/videos/upload (POST) should upload a video', async () => {
    const filePath = path.resolve(__dirname, '../video/ahatamatar-c921210b-ccc7-418b-b811-77afd6ff8cca.mp4');

    if (!fs.existsSync(filePath)) {
      throw new Error('Test file does not exist at ' + filePath);
    }
    await request(app.getHttpServer())
    .post('/videos/upload')
    .attach('file', filePath)
    .expect(201);
  });

  it("/videos/:id/trim (POST) should trim a video", async () => {
    const video = await videoRepository.save({
      title: "Video to Trim",
      description: "Description",
      filename: "video.mp4",
      path: "uploads/video.mp4",
      size: 12345,
      duration: 60,
    });

    const response = await request(app.getHttpServer())
      .post(`/videos/${video.id}/trim`)
      .set({ authorization: `Uml5YVNoYXJtYQ==` })
      .send({ startTime: 10, endTime: 20 })
      .expect(200);

    expect(response.body).toHaveProperty("path");
    expect(response.body.duration).toBeLessThan(60);
  });

  it("/videos/merge (POST) should merge multiple videos", async () => {
    const video1 = await videoRepository.save({
      title: "Video 1",
      description: "Description 1",
      filename: "video1.mp4",
      path: "uploads/video1.mp4",
      size: 12345,
      duration: 30,
    });

    const video2 = await videoRepository.save({
      title: "Video 2",
      description: "Description 2",
      filename: "video2.mp4",
      path: "uploads/video2.mp4",
      size: 67890,
      duration: 40,
    });

    const response = await request(app.getHttpServer())
      .post(`/videos/merge`)
      .set({ authorization: `Uml5YVNoYXJtYQ==` })
      .send({ videoIds: [video1.id, video2.id] })
      .expect(200);

    expect(response.body).toHaveProperty("path");
    expect(response.body.duration).toBeGreaterThan(
      video1.duration + video2.duration,
    );
  });
});
