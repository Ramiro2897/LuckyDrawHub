import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const adminRepository = AppDataSource.getRepository(User);

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Faltan datos en la petición.");
            return res.status(400).json({ general: "Datos incompletos" });
        }

        const admin = await adminRepository.findOne({ where: { email } });

        if (!admin) {
            console.log("Admin no encontrado en la base de datos.");
            return res.status(401).json({ general: "Credenciales incorrectas" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            console.log("La contraseña no coincide.");
            return res.status(401).json({ general: "Credenciales incorrectas" });
        }

        console.log("Inicio de sesión exitoso para el usuario:", admin.id);

        const sessionUUID = uuidv4();
        admin.session_uuid = sessionUUID;
        await adminRepository.save(admin);

        const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: "7d" });

        return res.json({ 
            token, 
            userId: admin.id 
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ general: "Error interno del servidor" });
    }
};
