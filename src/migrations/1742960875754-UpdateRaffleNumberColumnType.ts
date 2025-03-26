import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRaffleNumberColumnType1742960875754 implements MigrationInterface {
    name = 'UpdateRaffleNumberColumnType1742960875754';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cambiar el tipo de la columna "number" de integer a varchar
        await queryRunner.query(`ALTER TABLE "raffle_number" ALTER COLUMN "number" TYPE varchar(4)`);

        // Asegurarse de que el valor por defecto de "price" sea eliminado si es necesario
        await queryRunner.query(`ALTER TABLE "raffle_number" ALTER COLUMN "price" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // En caso de revertir, cambiar el tipo de la columna "number" de varchar a integer
        await queryRunner.query(`ALTER TABLE "raffle_number" ALTER COLUMN "number" TYPE integer`);

        // Restaurar el valor por defecto de "price" a 0
        await queryRunner.query(`ALTER TABLE "raffle_number" ALTER COLUMN "price" SET DEFAULT '0'`);
    }
}
