import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToRaffleNumber1742940413683 implements MigrationInterface {
    name = 'AddFieldsToRaffleNumber1742940413683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "email" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "department" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "city" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "price"`);
    }

}
