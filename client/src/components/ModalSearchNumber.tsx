import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/searchModal.module.css";

const API_URL = import.meta.env.VITE_API_URL;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ general: string }>({ general: "" });
  const [numbers, setNumbers] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!email) {
      setErrors({ general: "Ingresa el correo para la búsqueda" });
      setTimeout(() => setErrors({ general: "" }), 5000);
      return;
    }

    setErrors({ general: "" });
    setNumbers([]);

    try {
      const response = await axios.post<{ numbers: string[] }>(
        `${API_URL}/api/auth/searchNumbers`, 
        { email }
      );

      if (response.data.numbers.length === 0) {
        setErrors({ general: "No tienes números asignados" });
      } else {
        setNumbers(response.data.numbers);
      }
    } catch (error) {
      setErrors({ general: "Error al consultar los números" });
    }

    // Eliminar cualquier error después de 5 segundos, sin importar de dónde venga
    setTimeout(() => setErrors({ general: "" }), 5000);
  };

  if (!isOpen) return null;

  const handleModalClose = () => {
    setEmail("");
    setErrors({ general: "" });
    setNumbers([]);
    onClose(); // Llamamos a onClose después de limpiar
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Consulta tus números</h2>
        <p className={`${styles.error} ${errors.general ? styles.show : ""}`}>{errors.general}</p>
        <input
          type="email"
          placeholder="Correo para la consulta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.contentButtons}>
          <button className={styles.btnSearch} onClick={handleSubmit}>
            Consultar
          </button>
          <button className={styles.btnClose} onClick={handleModalClose}>Cerrar</button>
        </div>

        {numbers.length > 0 && (
        <div className={styles.results}>
          <p>Tus números:</p>
          <ul>
            {numbers.map((num, index) => (
              <li key={index}>{num}</li>
            ))}
          </ul>
          <div className={styles.reminder}>Recuerda: Mantente atento a la fecha del sorteo 
            y revisa los resultados para conocer al ganador. ¡Mucha suerte! 🎉
          </div>
          <div className={styles.textEnd}> ¡Gracias por tu compra! </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
