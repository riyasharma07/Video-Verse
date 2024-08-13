/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SharedLink } from "../../../db/links.entity";
import { Repository } from "typeorm";

@Injectable()
export class SharedLinksRepository {
  constructor(
    @InjectRepository(SharedLink)
    private readonly repository: Repository<SharedLink>,
  ) {}

  async getByToken(token: string): Promise<SharedLink | null> {
    return await this.repository.findOne({ where: { token } });
  }

  async save(sharedLink: SharedLink): Promise<SharedLink> {
    return await this.repository.save(sharedLink);
  }
}