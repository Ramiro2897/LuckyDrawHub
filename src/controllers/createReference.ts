import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";
import { In } from "typeorm";

export const createReference = async (req: Request, res: Response) => {
  try {
    const { invoice, selectedNumbers } = req.body;
    console.log('datos para reservar', invoice, selectedNumbers);

    if (!invoice || !selectedNumbers || !Array.isArray(selectedNumbers)) {
      return res.status(400).json({ errors: { general: "Datos inválidos" } });
    }

    const raffleNumberRepo = AppDataSource.getRepository(RaffleNumber);

    // Verificamos que los números existen y no están vendidos
    const numbersToUpdate = await raffleNumberRepo.findBy({
      number: In(selectedNumbers),
      isSold: false, // Aseguramos que no estén vendidos
    });

    if (numbersToUpdate.length !== selectedNumbers.length) {
      return res.status(400).json({ errors: { general: "Algunos números no están disponibles" } });
    }

    // Actualizamos los números con la referencia de pago
    for (const raffleNumber of numbersToUpdate) {
      raffleNumber.paymentReference = invoice;
    }

    await raffleNumberRepo.save(numbersToUpdate);

    return res.status(200).json({ message: "Referencia asignada correctamente" });

  } catch (error) {
    console.error("❌ Error en createReference:", error);
    return res.status(500).json({ errors: { general: "Error interno del servidor" } });
  }
};
