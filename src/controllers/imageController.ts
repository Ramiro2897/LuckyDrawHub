import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Image } from "../entities/Image";

export const getImages = async (req: Request, res: Response) => {
  try {
    const images = await AppDataSource.getRepository(Image).find();
    return res.json(images);
  } catch (error) {
    return res.status(500).json({ errors: { general: "Error al obtener las imágenes" } });
  }
};
