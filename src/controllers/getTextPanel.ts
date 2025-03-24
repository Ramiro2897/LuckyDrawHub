import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { generalTexts } from "../entities/generalTexts";

const textRepository = AppDataSource.getRepository(generalTexts);

// Función genérica para obtener texto por título
const getTextByTitle = async (req: Request, res: Response, title: string): Promise<Response> => {
  try {
    // Verificar si el usuario está autenticado
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
    } else {
      console.log('Usuario autenticado:', user);
    }
    
    // Buscar el texto en la base de datos
    const text = await textRepository.findOne({ where: { title } });

    if (!text) {
      return res.status(404).json({ errors: { general: "Texto no encontrado" } });
    }

    return res.status(200).json({ text: text.content });
  } catch (error) {
    return res.status(500).json({ errors: { general: "Error interno del servidor" } });
  }
};

// Exportar funciones específicas reutilizando getTextByTitle
export const getHeaderText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido header");
export const getDateText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido fecha");
export const getPrizeText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido premio");
export const getCardOneText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido premio uno");
export const getCardTwoText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido premio dos");
export const getCardThreeText = (req: Request, res: Response) => getTextByTitle(req, res, "contenido premio tres");
