import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { generalTexts } from "../entities/generalTexts";
import { Image } from "../entities/Image";

const textRepository = AppDataSource.getRepository(generalTexts);
const imageRepository = AppDataSource.getRepository(Image);

// Función genérica para obtener texto público por título
const getPublicTextByTitle = async (req: Request, res: Response, title: string): Promise<Response> => {
  try {
    const text = await textRepository.findOne({ where: { title } });

    if (!text) {
      return res.status(404).json({ errors: { general: "Error inesperado" } });
    }

    return res.status(200).json({ text: text.content });
  } catch (error) {
    console.error(`Error al obtener el texto (${title}):`, error);
    return res.status(500).json({ errors: { general: "Error interno del servidor." } });
  }
};

// Exportar funciones específicas reutilizando getPublicTextByTitle
export const getHeaderTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido header");
export const getDateTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido fecha");
export const getPrizeTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido premio");
export const getCardOneTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido premio uno");
export const getCardTwoTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido premio dos");
export const getCardThreeTextPublic = (req: Request, res: Response) => getPublicTextByTitle(req, res, "contenido premio tres");


// metodo para mostrar las imagenes
export const getPublicImages = async (req: Request, res: Response) => {
  try {
    const images = await imageRepository.find();
    return res.json(images);
  } catch (error) {
    return res.status(500).json({ errors: { general: "Error al obtener las imágenes" } });
  }
};