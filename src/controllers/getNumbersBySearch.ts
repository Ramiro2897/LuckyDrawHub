import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";

const raffleNumberRepository = AppDataSource.getRepository(RaffleNumber);

export const getNumbersBySearch = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { search } = req.query;

        if (!search || typeof search !== "string") {
            return res.status(400).json({ errors: { search: "Ingresa un término de búsqueda." } });
        }

        if (!/^\d+$/.test(search)) {
            return res.status(400).json({ errors: { search: "Ingresa un número válido." } });
        }

        const numbers = await raffleNumberRepository.find({
            where: { number: search.toString(), isBlocked: false },
            select: ["number"]
        });

        if (numbers.length === 0) {
            return res.status(404).json({ errors: { search: "Número no disponible." } });
        }

        return res.json({ numbers: numbers.map(n => n.number) });
    } catch (error) {
        console.error("Error al buscar los números:", error);
        return res.status(500).json({ errors: { search: "Error interno del servidor." } });
    }
};
