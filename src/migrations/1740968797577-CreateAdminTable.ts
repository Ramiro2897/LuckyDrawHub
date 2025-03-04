import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminTable1740968797577 implements MigrationInterface {
    name = 'CreateAdminTable1740968797577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "general_texts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_155f3b8ab9b3a8a08ac24603038" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "general_texts"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
