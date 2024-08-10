import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';

const port = 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  void app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
  });
}
bootstrap();
