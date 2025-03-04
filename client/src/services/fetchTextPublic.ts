import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface TextResponse {
  text: string;
}

// Función (servicio) para traer el texto del header (sin autenticación)
export const fetchHeaderTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/headerPublicText`);
    return response.data.text;
  } catch (error: any) {
    const errorMessage = error.response?.data?.errors?.general || "Ocurrió un error inesperado.";
    throw { errors: { general: errorMessage } }; 
  }
};

// Función para traer la fecha
export const fetchDateTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/datePublicText`);
    return response.data.text;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer el texto del premio
export const fetchPrizeTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/prizePublicText`);
    return response.data.text;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer el texto de la primera tarjeta
export const fetchCardOneTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardOnePublicText`);
    return response.data.text;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer el texto de la segunda tarjeta
export const fetchCardTwoTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardTwoPublicText`);
    return response.data.text;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer el texto de la tercera tarjeta
export const fetchCardThreeTextPublic = async (): Promise<string> => {
  try {
    const response = await axios.get<TextResponse>(`${API_URL}/api/auth/cardThreePublicText`);
    return response.data.text;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};