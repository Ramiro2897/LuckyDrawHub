import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";

const raffleNumberRepository = AppDataSource.getRepository(RaffleNumber);

export const generateNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { totalNumbers, digits, startRange, rafflePrice } = req.body;

        // Validaciones
        if (!totalNumbers || !digits || !rafflePrice) {
            return res.status(400).json({ errors: { general: "Datos incompletos" } });
        }

        if (isNaN(totalNumbers) || isNaN(digits) || (startRange && isNaN(startRange))) {
            return res.status(400).json({ errors: { general: "Todos los valores deben ser numéricos" } });
        }

        if (totalNumbers > 10000) {
            return res.status(400).json({ errors: { general: "No puedes generar más de 10,000 números a la vez" } });
        }

        // Validación de rafflePrice
        if (isNaN(rafflePrice) || rafflePrice <= 0 || !Number.isInteger(rafflePrice)) {
            return res.status(400).json({ errors: { general: "El precio de la rifa debe ser un número entero mayor a 0" } });
        }

        // Determinar el rango permitido
        let minRange: number;
        let maxRange: number;

        if (digits === 3) {
            minRange = 1;   // 001
            maxRange = 999; // 999
        } else if (digits === 4) {
            minRange = 1;    // 0001
            maxRange = 9999; // 9999
        } else {
            return res.status(400).json({ errors: { general: "Solo se permiten números de 3 o 4 cifras" } });
        }

        if (totalNumbers > maxRange) {
            return res.status(400).json({
                errors: { general: `No puedes generar más de ${maxRange} números para una rifa de ${digits} dígitos.` }
            });
        }

        if (startRange) {
            const numericStartRange = parseInt(startRange, 10);
            if (numericStartRange < minRange || numericStartRange > maxRange) {
                return res.status(400).json({ errors: { general: `El rango de inicio debe estar entre ${String(minRange).padStart(digits, "0")} y ${String(maxRange).padStart(digits, "0")}` } });
            }
            minRange = numericStartRange; // Si el rango es válido, se usa como inicio
        }

        // Reiniciar la tabla eliminando los registros y reiniciando los IDs
        await raffleNumberRepository.query(`TRUNCATE TABLE raffle_number RESTART IDENTITY CASCADE`);

        // Generar números aleatorios sin repetir
        const numbersSet = new Set<string>();  // Cambiado a Set<string> para almacenar los números formateados

        while (numbersSet.size < totalNumbers) {
            const randomNum = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
            const formattedNum = String(randomNum).padStart(digits, "0"); // Aplicar relleno con ceros
            numbersSet.add(formattedNum); // Almacenar el número formateado como string
        }

        // Guardar los números en la base de datos como `number`
        const formattedNumbers = Array.from(numbersSet).map(num => ({
            number: num, // Guardar como string con ceros a la izquierda
            price: rafflePrice
        }));

        await raffleNumberRepository.save(formattedNumbers);

        return res.json({ message: "Números generados correctamente" });
    } catch (error) {
        console.error("Error al generar números:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};
