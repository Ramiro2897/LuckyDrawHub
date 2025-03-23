import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const adminRepository = AppDataSource.getRepository(User);

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del header
    if (!token) {
      res.status(401).json({ errors: { general: "Admin no autenticado" } });
      return;
    }

    // Decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number, exp: number };

    // Verificar si el token ha expirado
    if (decoded.exp * 1000 < Date.now()) {
      res.status(401).json({ errors: { general: "Token expirado" } });
      return;
    }

    // Buscar el usuario en la base de datos
    const admin = await adminRepository.findOne({ where: { id: decoded.id } });

    if (!admin || !admin.session_uuid) {
      res.status(403).json({ errors: { general: "Sesión no válida" } });
      return;
    }

    // Guardar el usuario en la request para su uso en otros controladores
    (req as any).user = admin;

    next(); // Pasar al siguiente middleware o controlador
  } catch (error: any) {
    console.error("Error al verificar el token:", error.message);
    res.status(401).json({ errors: { general: "Token inválido" } });
  }
};
