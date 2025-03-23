import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("admin") //tabla en base de datos
export class  User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: "uuid", nullable: true }) 
    session_uuid: string | null;
}
