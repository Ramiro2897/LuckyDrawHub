import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RaffleNumber } from "./RaffleNumber"; // Asegúrate de importar correctamente

@Entity()
export class Raffle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  totalNumbers: number;

  @Column()
  description: string;

  @OneToMany(() => RaffleNumber, (raffleNumber: RaffleNumber) => raffleNumber.raffle)
  numbers: RaffleNumber[];
}
