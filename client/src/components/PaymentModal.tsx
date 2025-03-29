import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/paymentModal.module.css";


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  rafflePrice: number; 
}

export {};
declare global {
  interface Window {
    ePayco: any;
  }
}


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedNumbers, rafflePrice }) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState(""); 
  const [errors, setErrors] = useState<{ general?: string;}>({});


  const API_URL = import.meta.env.VITE_API_URL;

  interface EpaycoResponse {
    data: {
      x_transaction_state: string;
    };
  }
  
  useEffect(() => {
    if (!reference) return;
  
    axios.get(`https://secure.epayco.co/validation/v1/reference/${reference}`)
      .then(({ data }) => { 
         data as EpaycoResponse;
      })
      .catch(() => {});
  }, [reference]);

  // funciona para cuando se hace el pago
  const handleSubmit =  async () => {
    setErrors({}); // Limpiar errores antes de validar

    if (!phone.trim()) {
      setErrors({ general: "El número de celular es obligatorio" });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setErrors({ general: "El celular debe tener 10 dígitos" });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!name.trim()) {
      setErrors({ general: "El nombre es obligatorio." });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!email.trim()) {
      setErrors({ general: "El correo es obligatorio." });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ general: "El correo no es válido." });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!selectedNumbers.length) {
      setErrors({ general: "Debe seleccionar al menos un número." });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    if (!window.ePayco) {
      setErrors({ general: "Error al generar pago." });
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    const newReference = `INV-${Date.now()}`;
    setReference(newReference);

    try {
      // 🔹 1. Mandamos SOLO la referencia al backend antes de abrir el checkout
      await axios.post(`${API_URL}/api/auth/create-invoice`, {
        invoice: newReference,
        selectedNumbers,
      });

    } catch (error: any) {
      const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
      setErrors(errorData);
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    const totalAmount = String(selectedNumbers.length * rafflePrice);
  
    const handler = window.ePayco.checkout.configure({
      key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY, 
      test: true, // modo pruebas...
    });

    const paymentData = {
      name: "Compra de números",
      description: `Pago por ${selectedNumbers.length} números`, 
      invoice: newReference,
      currency: "COP",
      amount: totalAmount,
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      external: "false",
      confirmation: `${API_URL}/api/auth/payment-confirmation`, 
      response: `${window.location.origin}/payment-success`, 
      email_billing: email,
      name_billing: name,
      mobilephone_billing: phone,
    };
  
    handler.open(paymentData);
  };
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.titleAndError}>
          <h2>Completa tu compra</h2>
          <p className={styles.error}>{errors.general}</p>
        </div>
        <div className={styles.formGroup}>
          <label>Celular</label>
          <input type="text" placeholder="Ingresa tu celular" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input type="text" placeholder="Ingresa tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Correo</label>
          <input type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Números seleccionados</label>
          <input type="text" placeholder="Ej: 12, 45, 78" value={selectedNumbers.join(", ")} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Total Números</label>
          <input type="number" placeholder="Cantidad total de números"  readOnly value={selectedNumbers.length}/>
        </div>
        <div className={styles.formGroup}>
          <label>Total a pagar</label>
          <input type="text" placeholder="$0.00"  value={`$${String(selectedNumbers.length * rafflePrice)}`} disabled />
        </div>
        <div className={styles.contentButtons}>
          <button className={styles.submitButton} onClick={handleSubmit}>Pagar</button>
          <button
            className={styles.closeButton}
            onClick={() => {
              document.querySelector(`.${styles.modal}`)!.classList.add(styles.fadeOut);
              setTimeout(onClose, 300);
            }}>Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
