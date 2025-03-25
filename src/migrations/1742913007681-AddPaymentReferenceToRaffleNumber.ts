import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentReferenceToRaffleNumber1742913007681 implements MigrationInterface {
    name = 'AddPaymentReferenceToRaffleNumber1742913007681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD "paymentReference" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP COLUMN "paymentReference"`);
    }

}
