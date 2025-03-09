import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { generalTexts } from "./entities/generalTexts";
import { Image } from "./entities/Image";
import { Raffle } from "./entities/Raffle";
import { RaffleNumber } from "./entities/RaffleNumber";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno antes de usarlas

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // ❌ Desactivar, usaremos migraciones
    entities: [User, generalTexts, Image, Raffle, RaffleNumber],
    subscribers: [],
    migrations: [__dirname + "/migrations/*.ts"], // ✅ Activar migraciones
});
