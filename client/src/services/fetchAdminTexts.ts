import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface TextResponse {
  text: string;
}

// Función para obtener texto del header (admin)
export const fetchHeaderTextAdmin = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/headerText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// Función para obtener la fecha (admin)
export const fetchDateTextAdmin = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/dateText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// Función para obtener el texto del premio (admin)
export const fetchPrizeTextAdmin = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/prizeText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// Función para obtener el texto de la primera tarjeta (admin)
export const fetchCardOneText = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardOneText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// Función para obtener el texto de la segunda tarjeta (admin)
export const fetchCardTwoText = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardTwoText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// Función para obtener el texto de la tercera tarjeta (admin)
export const fetchCardThreeText = async (token?: string): Promise<string> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardThreeText`, { headers });
    return response.data.text;
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};

// funcion para traer las imagenes que se muestran en el panel
interface ImageResponse {
  url: string;
}
export const fetchImages = async (token?: string): Promise<string[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get<ImageResponse[]>(`${API_URL}/api/auth/images`, { headers });
    // console.log("📸 Respuesta del servidor (imagenes):", response.data);
    return response.data.map((img) => img.url);
  } catch (error: any) {
    throw error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
  }
};


