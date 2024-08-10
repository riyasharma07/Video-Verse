/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './src/db/VideoVerseDB.sqlite',
  entities: [User, Video],
  synchronize: true, // Set to true for development
  migrations: ['./src/db/migrations/*.ts'],  // Correct path to migrations
  logging: true,
});
