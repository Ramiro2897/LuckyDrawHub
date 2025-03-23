import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";

const raffleNumberRepository = AppDataSource.getRepository(RaffleNumber);

export const getNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const numbers = await raffleNumberRepository.find({
            where: { isBlocked: false },
            select: ["number"]
        });

        return res.json({ numbers: numbers.map(n => n.number) });
    } catch (error) {
        console.error("Error al obtener los números:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};
