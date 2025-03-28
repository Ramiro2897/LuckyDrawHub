import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Raffle } from "./Raffle";

@Entity()
export class RaffleNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 4 }) 
  number: string;

  @Column({ default: false })
  isSold: boolean; 

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: "varchar", nullable: true }) 
  paymentReference: string | null;

  @Column({ type: "integer", nullable: false }) 
  price: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  department: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  city: string | null;

  @Column({ type: "varchar", length: 20, nullable: true }) 
  mobile: string | null;

  @ManyToOne(() => Raffle, (raffle) => raffle.numbers, { onDelete: "CASCADE" })
  raffle: Raffle;
}
