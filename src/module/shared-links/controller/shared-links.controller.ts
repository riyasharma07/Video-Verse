/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Get,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { SharedLinksService } from "../service/shared-links.service";

@Controller("shared-links")
export class SharedLinksController {
  constructor(private readonly sharedLinksService: SharedLinksService){}

  @Post(":id/share")
  async shareVideo(
    @Param("id", ParseIntPipe) id: number,
    @Body("expiresIn") expiresIn: number,
  ) {
    if (expiresIn <= 0) {
      throw new BadRequestException("Expiry time must be positive");
    }

    return this.sharedLinksService.generateSharedLink(id, expiresIn);
  }

  @Get(':token')
  async getSharedVideo(@Param('token') token: string) {
    const sharedLink = await this.sharedLinksService.getByToken(token);
    if (!sharedLink) {
      throw new NotFoundException('Link not found');
    }

    if (new Date() > sharedLink.expiresAt) {
      throw new NotFoundException('Link has expired');
    }

    return sharedLink.video;
  }
}
