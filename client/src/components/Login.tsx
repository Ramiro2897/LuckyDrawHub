import styles from '../styles/login.module.css';
import { useState } from "react";
import { login } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState(""); //estados para almacenar los datos y guardarlos
    const [password, setPassword] = useState("");

    // funcion que llama a el servicio login que se encarga de mandar los datos (axios)
    const handleLogin = async () => {
      alert('entra aqui')
        try {
            const data = await login(email, password);
            console.log('datos del admin', email, password);
            console.log("Token recibido:", data.token);
        } catch (error) {
            console.error("Error en el login");
        }
    };

    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Iniciar Sesión</h2>

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

    );
};

export default Login;
