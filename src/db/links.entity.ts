/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Video } from './video.entity';

@Entity('shared_links')
export class SharedLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => Video, (video) => video.sharedLinks)
  video: Video;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
