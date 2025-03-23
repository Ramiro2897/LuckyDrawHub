import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface GenerateResponse {
  message: string;
}

// Función para generar números de la rifa
export const generateRaffleNumbers = async (totalNumbers: number, digits: number, startRange: number,token?: string | null ): Promise<string> => {
  console.log('lo que llega',  totalNumbers, digits, startRange)
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post<GenerateResponse>(
      `${API_URL}/api/auth/generateNumbers`,
      { totalNumbers, digits, startRange },
      { headers }
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};
