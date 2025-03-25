import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";
import dotenv from "dotenv";

dotenv.config();

export const paymentNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("📩 Recibiendo confirmación de pago de ePayco...");
        console.log("🔹 Datos recibidos:", req.body);

        const { x_transaction_state, x_cod_transaction_state, x_response, x_extra1 } = req.body;
        console.log('valor de los numeros', x_extra1)


        // Validamos el estado del pago
        if (x_transaction_state === "Aceptada" || x_cod_transaction_state === "1") {
            console.log("✅ Pago aprobado correctamente");

            // Verificamos si se enviaron los números seleccionados
            if (!x_extra1) {
                console.warn("⚠️ No se recibieron números en la confirmación de pago.");
                return res.status(400).json({ errors: { general: "No se enviaron números para bloquear." } });
            }

            // Convertimos los números en un array
            const numbersArray = x_extra1 ? x_extra1.split(",").map((num: string) => parseInt(num.trim())) : [];

            // Marcamos los números como bloqueados en la base de datos
            await AppDataSource.getRepository(RaffleNumber)
                .createQueryBuilder()
                .update(RaffleNumber)
                .set({ isBlocked: true })
                .where("number IN (:...numbers)", { numbers: numbersArray })
                .execute();

            console.log("🔒 Números bloqueados exitosamente:", numbersArray);
        } else {
            console.warn("❌ Pago rechazado o en proceso:", x_response);
        }

        // Respondemos a ePayco (importante para que no vuelva a enviar la confirmación)
        return res.status(200).send("OK");
    } catch (error) {
        console.error("❌ Error al procesar la confirmación de pago:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};

