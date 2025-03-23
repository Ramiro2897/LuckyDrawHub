import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionUUIDToAdmin1741619467331 implements MigrationInterface {
    name = 'AddSessionUUIDToAdmin1741619467331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD "session_uuid" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "session_uuid"`);
    }

}
