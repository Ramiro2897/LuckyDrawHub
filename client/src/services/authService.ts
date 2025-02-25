import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string, navigate: (path: string) => void) => {
    try {
        const response = await axios.post<{ token: string; userId: number }>(`${API_URL}/api/auth/login`, { email, password });

        // Guardamos el token en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.userId.toString());

        console.log("el id", response.data.userId);
        console.log(response.data, "aquiiii llega"); // Respuesta si todo sale bien

        // Redirigir después del login
        navigate("/panel");

        return response.data;
    } catch (error) {
        throw new Error("Error en el login");
    }
};
