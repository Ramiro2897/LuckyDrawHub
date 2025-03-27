import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";
import dotenv from "dotenv";

dotenv.config();

export const paymentNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("📩 Recibiendo confirmación de pago de ePayco...");

        const { x_transaction_state, x_cod_transaction_state, x_response, x_id_invoice, x_customer_email } = req.body;
        console.log("📌 Referencia de pago recibida:", x_id_invoice);
        console.log("📌 correo recibido:", x_customer_email);

        // Validamos el estado del pago
        if (x_transaction_state === "Aceptada" || x_cod_transaction_state === "1") {
            console.log("✅ Pago aprobado correctamente");

            // Verificamos que se haya recibido la referencia de pago
            if (!x_id_invoice) {
                console.warn("⚠️ No se recibió la referencia de pago.");
                return res.status(400).json({ errors: { general: "No se recibió la referencia de pago." } });
            }

            // Buscar los números asociados a la referencia de pago
            const numbersToUpdate = await AppDataSource.getRepository(RaffleNumber)
                .createQueryBuilder("number")
                .where("number.paymentReference = :reference", { reference: x_id_invoice})
                .getMany();

            if (numbersToUpdate.length === 0) {
                console.warn("⚠️ No se encontraron números asociados a esta referencia.");
                return res.status(404).json({ errors: { general: "No hay números para bloquear." } });
            }

            // Bloquear y marcar como vendidos los números
            await AppDataSource.getRepository(RaffleNumber)
                .createQueryBuilder()
                .update(RaffleNumber)
                .set({ isBlocked: true, isSold: true, email: x_customer_email })
                .where("paymentReference = :reference", { reference: x_id_invoice })
                .execute();

            console.log("🔒 Números bloqueados y vendidos exitosamente:", numbersToUpdate.map(n => n.number));
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
