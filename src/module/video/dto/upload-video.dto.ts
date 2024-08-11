/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ description: 'Title of the video' })
  title: string;

  @ApiProperty({ description: 'Description of the video', required: false })
  description?: string;
}
