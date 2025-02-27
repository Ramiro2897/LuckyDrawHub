import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string, navigate: (path: string) => void) => {
    try {
        const response = await axios.post<{ token: string; userId: number }>(`${API_URL}/api/auth/login`, { email, password });

        // Guardamos el token en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.userId.toString());

        // Redirigir después del login
        navigate("/panel");

        return response.data;
    } catch (error: any) {
        throw error; 
    }
};
