import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { RaffleNumber } from "../entities/RaffleNumber";
import dotenv from "dotenv";

dotenv.config();

export const paymentNumbers = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("📩 Recibiendo confirmación de pago de ePayco...");

        const { 
            x_transaction_state, 
            x_cod_transaction_state, 
            x_response, 
            x_id_invoice, 
            x_customer_email, 
            x_amount // Agregamos el monto del pago
        } = req.body;

        console.log("📌 Referencia de pago recibida:", x_id_invoice);
        console.log("📌 Correo recibido:", x_customer_email);
        console.log("📌 Monto pagado:", x_amount);

        if (!x_id_invoice) {
            console.warn("⚠️ No se recibió la referencia de pago.");
            return res.status(400).json({ errors: { general: "No se recibió la referencia de pago." } });
        }

        // Validamos el estado del pago
        if (x_transaction_state !== "Aceptada" && x_cod_transaction_state !== "1") {
            console.warn("❌ Pago rechazado o en proceso:", x_response);
            return res.status(400).json({ errors: { general: "El pago no fue aprobado." } });
        }

        console.log("✅ Pago aprobado correctamente");

        // Iniciamos una transacción para evitar inconsistencias
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Buscar los números asociados a la referencia de pago
            const numbersToUpdate = await queryRunner.manager.find(RaffleNumber, {
                where: { paymentReference: x_id_invoice }
            });

            if (numbersToUpdate.length === 0) {
                console.warn("⚠️ No se encontraron números asociados a esta referencia.");
                await queryRunner.rollbackTransaction();
                return res.status(404).json({ errors: { general: "No hay números para bloquear." } });
            }

            // Verificar si algún número ya está vendido
            const alreadySold = numbersToUpdate.filter(n => n.isSold);
            if (alreadySold.length > 0) {
                console.warn("⚠️ Algunos números ya fueron vendidos:", alreadySold.map(n => n.number));
                await queryRunner.rollbackTransaction();
                return res.status(400).json({ errors: { general: "Algunos números ya fueron vendidos a otro usuario." } });
            }

            // Validar que el monto pagado coincide con el precio de los números
            const expectedAmount = numbersToUpdate.reduce((total, num) => total + num.price, 0);

            if (Number(x_amount) !== expectedAmount) {
                console.warn(`⚠️ Monto incorrecto. Esperado: ${expectedAmount}, Recibido: ${x_amount}`);
                await queryRunner.rollbackTransaction();
                return res.status(400).json({ errors: { general: "El monto pagado no coincide con el precio de los números seleccionados." } });
            }

            // Bloquear y marcar como vendidos los números
            await queryRunner.manager.update(
                RaffleNumber,
                { paymentReference: x_id_invoice },
                { 
                    isBlocked: true, 
                    isSold: true, 
                    email: x_customer_email,
                    mobile: req.body.x_customer_movil,
                    city: req.body.x_customer_city 
                }
            );

            console.log("🔒 Números bloqueados y vendidos exitosamente:", numbersToUpdate.map(n => n.number));

            // Confirmamos la transacción
            await queryRunner.commitTransaction();
        } catch (error) {
            console.error("❌ Error en la transacción:", error);
            await queryRunner.rollbackTransaction();
            return res.status(500).json({ errors: { general: "Error al procesar la compra." } });
        } finally {
            await queryRunner.release();
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("❌ Error al procesar la confirmación de pago:", error);
        return res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
};
