/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { SharedLink } from './links.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()   
  updatedAt: Date;

  @Column()
  size: number;

  @Column()
  duration: number;

  @OneToMany(() => SharedLink, (sharedLink) => sharedLink.video)
  sharedLinks: SharedLink[];
}
