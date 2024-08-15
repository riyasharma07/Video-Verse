/* eslint-disable prettier/prettier */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    stat: jest.fn().mockResolvedValue({
      isFile: () => true,
      size: 1000,
    }),
  },
}));

describe('VideoController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/videos/upload (POST) should upload a video', async () => {
    const filePath = path.resolve(__dirname, '../video/ahatamatar-c921210b-ccc7-418b-b811-77afd6ff8cca.mp4');
  
    if (!fs.existsSync(filePath)) {
      throw new Error('Test file does not exist at ' + filePath);
    }
    await request(app.getHttpServer())
      .post('/videos/upload')
      .set({ authorization: `Uml5YVNoYXJtYQ==` })
      .field('title', 'Test Video')
      .field('description', 'Test Description')
      .attach('file', filePath)
      .timeout(60000) 
      .expect(201);
  });
  

  it("/videos/:id/trim (POST) should trim a video", async () => {
    const response = await request(app.getHttpServer())
      .post(`/videos/96/trim`)
      .set({ authorization: `Uml5YVNoYXJtYQ==` })
      .send({ startTime: 1, endTime: 3 })
      .timeout(60000) 
      .expect(201);

    expect(response.body).toHaveProperty("path");
    expect(response.body.duration).toBeLessThan(60);
  });

  it("/videos/merge (POST) should merge multiple videos", async () => {
    const response = await request(app.getHttpServer())
      .post(`/videos/merge`)
      .set({ authorization: `Uml5YVNoYXJtYQ==` })
      .send({ "videoIds": [89, 90] })
      .expect(201);

    expect(response.body).toHaveProperty("path");
  });
});
