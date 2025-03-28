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

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkPurchaseError = async () => {
            try {
                const response = await axios.get<{ error: string | null }>(`${API_URL}/error-compra`);
                if (response.data.error) {
                    alert(response.data.error);
                }
            } catch (error) {
                console.error("❌ Error al verificar la compra:", error);
            }
        };
    
        checkPurchaseError();
    }, []);
    

    useEffect(() => {
        if (!refPayco) {
            navigate("/"); 
            return;
        }

        axios.get<EpaycoResponse>(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
            .then(({ data }) => {
                // Acceder correctamente al estado de la transacción
                const state = data.data.x_transaction_state;

                if (!state) {
                    navigate("/");
                    return;
                }
                
                if (state === "Aceptada") {
                    setIsSuccess(true);
                } else {
                    setIsSuccess(false);
                    navigate("/");
                }
            })
            .catch(err => {
                console.error("❌ Error al consultar el pago:", err);
                navigate("/"); 
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
