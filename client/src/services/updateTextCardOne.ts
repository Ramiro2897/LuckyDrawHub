import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Servicio reutilizable para actualizar texto en la base de datos
export const updateTextCardOne = async (title: string, content: string): Promise<any> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { errors: { general: "La sesión finalizó." } };
  }

  try {
    const response = await axios.put(
      `${API_URL}/api/auth/updateTextCardOne`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    return error.response?.data || { errors: { general: "Ocurrió un error inesperado." } };
  }
};
