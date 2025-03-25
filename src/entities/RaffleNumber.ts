import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Raffle } from "./Raffle";

@Entity()
export class RaffleNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ default: false })
  isSold: boolean; 

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: "varchar", nullable: true }) // 🔹 Campo para la referencia de pago
  paymentReference: string | null;

  @ManyToOne(() => Raffle, (raffle) => raffle.numbers, { onDelete: "CASCADE" })
  raffle: Raffle;
}
