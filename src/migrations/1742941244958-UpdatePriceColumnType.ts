import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceColumnType1742941244958 implements MigrationInterface {
    name = 'UpdatePriceColumnType1742941244958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "price" integer DEFAULT 0 NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "price" numeric(10,2)`);
    }

}
