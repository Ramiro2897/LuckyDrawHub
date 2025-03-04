import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("general_texts")
export class generalTexts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Ya no es nullable, porque el título se asigna en el controlador
  title: string;

  @Column("text")
  content: string;

  @CreateDateColumn()
  created_at: Date;
}

