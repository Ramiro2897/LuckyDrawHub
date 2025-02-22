import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin } from "./entities/User";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno antes de usarlas

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // ⚠️ En producción, usa migrations en vez de esto
    logging: false,
    entities: [Admin],
    subscribers: [],
    // migrations: ["src/migrations/*.ts"], // Solo descomentar cuando agregues migraciones
});
