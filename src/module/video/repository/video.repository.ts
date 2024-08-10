/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/db/dbService';
import { Video } from 'src/db/video.entity';
import { Repository, QueryRunner } from 'typeorm';

@Injectable()
export class VideoRepository {
  private repository: Repository<Video>;

  constructor() {
    this.repository = AppDataSource.getRepository(Video);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<Video> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(Video);
    }
    return this.repository;
  }

}
