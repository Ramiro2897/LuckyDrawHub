import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const adminRepository = AppDataSource.getRepository(User);
const SECRET_KEY = "luckysecret";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del header
    if (!token) {
      // console.log("No se envió el token"); // Para pruebas
      res.status(401).json({ errors: { general: "Admin no autenticado" } });
      return;
    }

    // Decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    // console.log("Token decodificado:", decoded);

    // Buscar el usuario en la base de datos
    const admin = await adminRepository.findOne({ where: { id: decoded.id } });

    if (!admin) {
      // console.log('token no valido o usuario no encontrado ')
      res.status(403).json({ error: "Token inválido o usuario no encontrado" });
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
