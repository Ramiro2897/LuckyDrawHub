import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRaffleAndRaffleNumber1741399896423 implements MigrationInterface {
    name = 'CreateRaffleAndRaffleNumber1741399896423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "raffle_number" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "isSold" boolean NOT NULL DEFAULT false, "isBlocked" boolean NOT NULL DEFAULT false, "raffleId" integer, CONSTRAINT "PK_502164d6f2f6fe9f1632c4cf13c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raffle" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalNumbers" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_f9dee47f552e25482a1f65c282e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "raffle_number" ADD CONSTRAINT "FK_f1dbf390a2b74cd34e8bccea8a8" FOREIGN KEY ("raffleId") REFERENCES "raffle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raffle_number" DROP CONSTRAINT "FK_f1dbf390a2b74cd34e8bccea8a8"`);
        await queryRunner.query(`DROP TABLE "raffle"`);
        await queryRunner.query(`DROP TABLE "raffle_number"`);
    }

}
