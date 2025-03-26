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

// Función para traer las imágenes públicas
export const fetchImagePublic = async (): Promise<string[]> => {
  try {
    const response = await axios.get<{ url: string }[]>(`${API_URL}/api/auth/imagesPublic`);
    return response.data.map((img) => img.url);
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer todos los números
export const fetchAllNumbers = async (): Promise<{ numbers: number[], price: number }> => {
  try {
    const response = await axios.get<{ numbers: number[], price: number }>(`${API_URL}/api/auth/allNumbers`);
    return { 
      numbers: response.data.numbers,
      price: response.data.price // 
    };
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// funcion para mostrar el progreso de l venta de numeros
export const fetchRaffleProgress = async (): Promise<number> => {
  try {
    const response = await axios.get<{ percentage: number }>(`${API_URL}/api/auth/raffleProgress`);
    return response.data.percentage;
  } catch (error: any) {
    throw { errors: { general: error.response?.data?.errors?.general || "Ocurrió un error inesperado." } };
  }
};

// Función para traer la búsqueda de números
interface NumbersResponse {
  numbers: number[];
}
export const fetchNumbersBySearch = async (query: string): Promise<number[]> => {
  try {
    const response = await axios.get<NumbersResponse>(`${API_URL}/api/auth/search`, {
      params: { search: query }  // Se envía correctamente como "search"
    });
    console.log(response.data.numbers, 'la busqueda');
    return response.data.numbers;
  } catch (error: any) {
    const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
    console.log(errorData, 'el error en el servicio')
    throw errorData;
  }
};
