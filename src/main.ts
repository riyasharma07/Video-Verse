/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { AppDataSource } from './db/dbService';

const port = 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  void app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
  });
  async function initializeDatabase() {
    try {
      await AppDataSource.initialize();

      await AppDataSource.runMigrations();

      console.log('Data Source has been initialized and migrations run.');
    } catch (error) {
      console.error('Error during Data Source initialization:', error);
    }
  }

  initializeDatabase();
}
bootstrap();
