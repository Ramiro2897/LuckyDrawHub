import axios from "axios";

// variable global de entorno
const API_URL = import.meta.env.VITE_API_URL; 

export const login = async (email: string, password: string) => {
      console.log('recibido', email, password);
    try {
        const response = await axios.post<{ token: string }>(`${API_URL}/api/auth/login`, { email, password });

        // Guardamos el token en localStorage
        localStorage.setItem("token", response.data.token);

        return response.data;
    } catch (error) {
        throw new Error("Error en el login");
    }
};
