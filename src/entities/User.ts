// modelos de la base de datos
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("admin") //tabla en base de datos
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}
