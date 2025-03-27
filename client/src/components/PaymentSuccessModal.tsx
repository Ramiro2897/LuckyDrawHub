import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/PaymentSuccessModal.module.css";

// Definir la estructura esperada de la respuesta de ePayco
interface EpaycoResponse {
    data: {
        x_transaction_state: string;
    };
}

const PaymentSuccessModal = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const refPayco = searchParams.get("ref_payco");
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (!refPayco) {
            navigate("/"); // Si no hay referencia, ir al inicio
            return;
        }

        axios.get<EpaycoResponse>(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
            .then(({ data }) => {
                console.log("📌 Respuesta de ePayco:", data);

                // Acceder correctamente al estado de la transacción
                const state = data.data.x_transaction_state;

                if (!state) {
                    console.warn("⚠️ No se encontró el estado de la transacción en la respuesta.");
                    navigate("/");
                    return;
                }

                console.log("📌 Estado del pago:", state);
                
                if (state === "Aceptada") {
                    setIsSuccess(true);
                } else {
                    setIsSuccess(false);
                    navigate("/"); // Si el pago fue rechazado o falló, redirigir de inmediato
                }
            })
            .catch(err => {
                console.error("❌ Error al consultar el pago:", err);
                navigate("/"); // En caso de error, redirigir al inicio
            });
    }, [refPayco, navigate]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    if (isSuccess === null) {
        return <div className={styles.loader}>Verificando pago...</div>;
    }

    return (
        isSuccess && (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h2>¡Pago Exitoso! 🎉</h2>
                    <p className={styles.info_mensaje}>Puedes consultar tus números en nuestra página.</p>
                    <p className={styles.reference}>Referencia de pago: {refPayco}</p>
                    <div className={styles.loader}>
                        <p className={styles.redirect}>Serás redirigido en unos segundos...</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default PaymentSuccessModal;
