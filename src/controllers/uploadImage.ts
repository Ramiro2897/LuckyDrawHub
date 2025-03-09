import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Image } from "../entities/Image";
import multer from "multer";
import path from "path";
import fs from "fs";

const ALLOWED_IMAGE_NAMES = ["premio1", "premio2", "premio3", "premio4", "premio5", "premio6"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const name = path.parse(file.originalname).name; // Nombre sin extensión
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${name}${ext}`);
        }
    }),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const name = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname).toLowerCase();
        const errors: string[] = [];

        if (!ALLOWED_IMAGE_NAMES.includes(name)) {
            errors.push(`Nombre de imagen no permitido: ${name}`);
        }

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            errors.push(`Extensión no permitida: ${ext}`);
        }

        if (errors.length > 0) {
            console.error("⛔ Error en validación de archivo:", errors.join(" | "));
            return cb(null, false); // ✅ Rechaza el archivo correctamente
        }

        cb(null, true);
    }
}).single("image"); // 👈 Asegúrate de que el campo en el frontend sea "image"

const imageRepository = AppDataSource.getRepository(Image);

export const uploadImage = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.error("⛔ Error de subida:", err.message);
                
                if (err.message === "File too large") {
                    return res.status(400).json({ errors: { general: "El archivo es demasiado grande" } });
                }
            
                return res.status(400).json({ errors: { general: err.message } });
            } else if (err) {
                console.error("⛔ Error desconocido:", err);
                return res.status(500).json({ errors: { general: "Error interno del servidor" } });
            }

            if (!req.file) {
                console.error("⛔ No se ha seleccionado ninguna imagen");
                return res.status(400).json({ errors: { general: "Archivo no válido o nombre no válido" } });
            }

            const fileName = req.file.filename;
            const name = path.parse(fileName).name;
            const imageUrl = `/uploads/${fileName}`;

            // 🔄 Elimina imágenes anteriores con el mismo nombre
            fs.readdirSync(uploadDir).forEach((file) => {
                if (path.parse(file).name === name && file !== fileName) {
                    fs.unlinkSync(path.join(uploadDir, file));
                }
            });

            // 🔄 Buscar imagen en la BD
            const existingImage = await imageRepository
                .createQueryBuilder("image")
                .where("image.url LIKE :pattern", { pattern: `%/uploads/${name}.%` })
                .getOne();

            if (existingImage) {
                existingImage.url = imageUrl;
                await imageRepository.save(existingImage);
                return res.status(200).json({ message: "Imagen actualizada con éxito", url: imageUrl });
            }

            const image = imageRepository.create({ url: imageUrl });
            await imageRepository.save(image);

            return res.status(201).json({ message: "Imagen subida con éxito", url: imageUrl });
        } catch (error) {
            console.error("⛔ Error al guardar la imagen en la BD:", error);
            return res.status(500).json({ errors: { general: "Error al guardar la imagen" } });
        }
    });
};
