import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMobileToRaffleNumber1743173095862 implements MigrationInterface {
    name = 'AddMobileToRaffleNumber1743173095862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "mobile" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "mobile"`);
    }

}
