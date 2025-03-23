import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const adminRepository = AppDataSource.getRepository(User);

export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = (req as any).user; // Ya está disponible gracias a verifyToken

        if (!admin) {
            console.log('No se encontró usuario en la petición');
            res.status(401).json({ errors: { general: "Usuario no autenticado" } });
            return;
        }

        await adminRepository.update(admin.id, { session_uuid: null });
        console.log('Sesión cerrada correctamente');

        res.json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.error("Error en el cierre de sesión:", error);
        res.status(500).json({ general: "Error interno del servidor" });
    }
};




