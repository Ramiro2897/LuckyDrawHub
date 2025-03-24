import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";

const raffleNumberRepository = AppDataSource.getRepository(RaffleNumber);

export const generateNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { totalNumbers, digits, startRange } = req.body;

        // Validaciones
        if (!totalNumbers || !digits) {
            return res.status(400).json({ errors: { general: "Datos incompletos" } });
        }

        if (isNaN(totalNumbers) || isNaN(digits) || (startRange && isNaN(startRange))) {
            return res.status(400).json({ errors: { general: "Todos los valores deben ser numéricos" } });
        }

        if (totalNumbers > 10000) {
            return res.status(400).json({ errors: { general: "No puedes generar más de 10,000 números a la vez" } });
        }

        // Determinar el rango permitido
        let minRange = digits === 3 ? 100 : 1000;
        let maxRange = digits === 3 ? 999 : 9999;

        if (startRange) {
            if (startRange < minRange || startRange > maxRange) {
                return res.status(400).json({ errors: { general: `El rango de inicio debe estar entre ${minRange} y ${maxRange}` } });
            }
            minRange = startRange; // Si hay un rango válido, lo tomamos como inicio
        }

        // Reiniciar la tabla eliminando los registros y reiniciando los IDs
        await raffleNumberRepository.query(`TRUNCATE TABLE raffle_number RESTART IDENTITY CASCADE`);

        // Generar números aleatorios sin repetir
        const numbersSet = new Set<number>();
        while (numbersSet.size < totalNumbers) {
            const randomNum = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
            numbersSet.add(randomNum);
        }

        const numbers = Array.from(numbersSet).map(num => {
            return raffleNumberRepository.create({ number: num });
        });

        await raffleNumberRepository.save(numbers);

        return res.json({ message: "Números generados correctamente" });
    } catch (error) {
        console.error("Error al generar números:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};
