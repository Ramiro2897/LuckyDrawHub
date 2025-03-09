import styles from '../styles/login.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState(""); //estados para almacenar los datos y guardarlos
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

    const navigate = useNavigate();

    // funcion que llama a el servicio login que se encarga de mandar los datos (axios)
    const handleLogin = async () => {
        try {
            await login(email, password, navigate);
        } catch (error: any) {
            if (error.response?.data.general) {
              setErrors({ general: error.response.data.general }); // Mostrar el error en "general"
            }
          }  
    };

    return (
    <div className={styles.contenAll}>   
      <div className={styles.container}>
        <h2 className={styles.title}>Ingresar</h2>
        {/* en caso de error mostrar el mensaje */}
        <div className={styles.error}>{errors.general ? errors.general : " "}</div>

        <input 
            type="text" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.input}
        />

        <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.input}
        />

        <button onClick={handleLogin} className={styles.button}>Ingresar</button>
      </div>
    </div>

    );
};

export default Login;
