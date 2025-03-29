import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";

const raffleNumberRepository = AppDataSource.getRepository(RaffleNumber);

// traer el porcentaje de numeros vendidos y bloqueados
export const raffleProgress = async (req: Request, res: Response): Promise<Response> => {
    try {
        const totalNumbers = await raffleNumberRepository.count();
        const soldOrBlockedNumbers = await raffleNumberRepository.count({
            where: [{ isSold: true }, { isBlocked: true }]
        });

        const percentage = totalNumbers > 0 ? Math.round((soldOrBlockedNumbers / totalNumbers) * 100) : 0;
        // console.log(percentage, 'valor de porcentaje de numeros vendidos');

        return res.json({ percentage });
    } catch (error) {
        console.error("Error al obtener el progreso de la rifa:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};

// traer todos los numeros que no esten vendidos
export const getNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const numbers = await raffleNumberRepository.find({
            where: { isBlocked: false, isSold: false },
            select: ["number", "price"]
        });
        const price = numbers.length > 0 ? numbers[0].price : 0;

        return res.json({ 
            numbers: numbers.map(n => n.number),
            price // 🔹 Enviamos el precio al frontend
        });
    } catch (error) {
        console.error("Error al obtener los números:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};

// realizar la busqueda de los numeros para dicho usuario
export const NumbersBySearch = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ errors: { general: "El correo es obligatorio" } });
        }

        const numbers = await raffleNumberRepository.find({
            where: { email },
            select: ["number"]
        });

        if (numbers.length === 0) {
            return res.json({ numbers: [], message: "No tienes números asignados" });
        }

        return res.json({ numbers: numbers.map(n => n.number) });
    } catch (error) {
        console.error("Error al buscar los números:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};


