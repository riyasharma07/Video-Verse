/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const port = 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Video-Verse API Documentation')
    .setDescription(`
      The Video-Verse API provides endpoints for managing video files. This API allows you to upload videos, trim existing videos, and merge multiple video clips into a single file. The API supports authentication via Bearer tokens and enforces limits on video file size and duration.
  
      **Endpoints:**
      - **Upload Video:** Uploads a video file with configurable size and duration limits.
      - **Trim Video:** Allows you to trim an existing video by specifying the start and end times.
      - **Merge Videos:** Merges multiple video clips into a single video file.
  
      **Authentication:**
      All endpoints require authentication via Bearer tokens. Include your token in the \`Authorization\` header as \`Bearer <token>\`.
  
      **Video Limits:**
      - **File Size:** Maximum file size is 25MB.
      - **Duration:** Minimum duration is 5 seconds, and maximum duration is 25 seconds.
  
      **Error Handling:**
      The API provides meaningful error messages for invalid requests or authentication issues.
  
      For more details on each endpoint, including request and response formats, refer to the individual endpoint documentation below.
    `)    
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
    const theme = new SwaggerTheme();
    const options = {
      explorer: true,
      customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
    };
    SwaggerModule.setup('api', app, document, options);
  
  await app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
  });
}

bootstrap();
