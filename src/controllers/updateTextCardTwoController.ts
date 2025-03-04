import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { generalTexts } from "../entities/generalTexts";

const textRepository = AppDataSource.getRepository(generalTexts);

export const updateTextCardTwo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Verificar si el usuario está autenticado
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
    }

    const { title, content } = req.body; // Recibimos ambos parámetros
    console.log("Título y contenido que llegan", title, content);

    // Verificar que tanto título como contenido estén presentes
    if (!title || !content) {
      return res.status(400).json({ errors: { general: "El título y el contenido son obligatorios" } });
    }

    // Verificamos si el texto con el título ya existe
    let existingText = await textRepository.findOne({ where: { title } });

    if (existingText) {
      // Si ya existe, lo actualizamos
      existingText.content = content;
      await textRepository.save(existingText);
      console.log("Texto actualizado correctamente");
      return res.status(200).json({ message: "Texto actualizado correctamente", data: existingText });
    } else {
      // Si no existe, creamos uno nuevo
      const newText = textRepository.create({
        title,
        content,
      });

      await textRepository.save(newText);

      return res.status(201).json({ message: "Texto guardado correctamente", data: newText });
    }
  } catch (error) {
    console.error("Error al guardar o actualizar el texto:", error);
    return res.status(500).json({ errors: { general: "Error interno del servidor" } });
  }
};
