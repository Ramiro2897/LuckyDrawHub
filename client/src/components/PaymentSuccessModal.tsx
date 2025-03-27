import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/PaymentSuccessModal.module.css"; 

const PaymentSuccessModal = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const refPayco = searchParams.get("ref_payco"); 

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/"); 
            window.location.reload();
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
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
    );
};

export default PaymentSuccessModal;
