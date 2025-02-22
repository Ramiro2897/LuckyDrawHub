import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Admin } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminRepository = AppDataSource.getRepository(Admin);

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        console.log("Datos recibidos:", { email, password });

        if (!email || !password) {
            console.log("Faltan datos en la petición.");
            return res.status(400).json({ message: "Email y contraseña son obligatorios." });
        }

        const admin = await adminRepository.findOne({ where: { email } });

        if (!admin) {
            console.log("Admin no encontrado en la base de datos.");
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            console.log("La contraseña no coincide.");
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        console.log("Inicio de sesión exitoso para el usuario:", admin.id);

        const token = jwt.sign({ id: admin.id }, "secret_key", { expiresIn: "1h" });

        return res.json({ token });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
