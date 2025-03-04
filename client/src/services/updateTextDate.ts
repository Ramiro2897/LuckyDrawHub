import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// servicio reutilizable para traer el texto del header
export const dateText = async (title: string, content: string): Promise<any> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { errors: { general: "La sesion finalizó." } };
  }

  console.log(content, "Texto que llega");

  try {
    const response = await axios.put(
      `${API_URL}/api/auth/textDate`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retornamos solo `data`
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    return error.response?.data || { errors: { general: "Ocurrió un error inesperado." } };
  }
};
