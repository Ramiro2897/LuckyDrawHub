import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Raffle } from "./Raffle";

@Entity()
export class RaffleNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ default: false })
  isSold: boolean; // Para marcar si el número está vendido

  @Column({ default: false })
  isBlocked: boolean; // Para marcar si el número está bloqueado

  @ManyToOne(() => Raffle, (raffle) => raffle.numbers, { onDelete: "CASCADE" })
  raffle: Raffle;
}
