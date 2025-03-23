import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";


dotenv.config();

export const paymentNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("📩 Recibiendo confirmación de pago de ePayco...");
        console.log("🔹 Datos recibidos:", req.body);

        const { x_transaction_state, x_cod_transaction_state, x_response } = req.body;

        // Validamos el estado del pago
        if (x_transaction_state === "Aceptada" || x_cod_transaction_state === "1") {
            console.log("✅ Pago aprobado correctamente");
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
