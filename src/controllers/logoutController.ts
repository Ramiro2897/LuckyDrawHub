import { Request, Response } from "express";

export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.error("Error en el cierre de sesión:", error);
        res.status(500).json({ general: "Error interno del servidor" });
    }
};
