import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1723291755614 implements MigrationInterface {
    name = 'InitialSchema1723291755614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "videos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar, "filename" varchar NOT NULL, "path" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_videos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar, "filename" varchar NOT NULL, "path" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_9003d36fcc646f797c42074d82b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_videos"("id", "title", "description", "filename", "path", "createdAt", "updatedAt", "userId") SELECT "id", "title", "description", "filename", "path", "createdAt", "updatedAt", "userId" FROM "videos"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`ALTER TABLE "temporary_videos" RENAME TO "videos"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" RENAME TO "temporary_videos"`);
        await queryRunner.query(`CREATE TABLE "videos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar, "filename" varchar NOT NULL, "path" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "videos"("id", "title", "description", "filename", "path", "createdAt", "updatedAt", "userId") SELECT "id", "title", "description", "filename", "path", "createdAt", "updatedAt", "userId" FROM "temporary_videos"`);
        await queryRunner.query(`DROP TABLE "temporary_videos"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "videos"`);
    }

}
