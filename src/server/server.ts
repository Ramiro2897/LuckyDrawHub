import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source"; 
import authRoutes from "../routes/authRoutes"; 
import createAdminUser from '../controllers/createAdminUser';

// Configuración del servidor
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Servir imágenes de "uploads"
const uploadsPath = path.resolve(__dirname, "../../uploads"); 

// console.log("Ruta absoluta de uploads:", uploadsPath);
app.use("/uploads", (req, res, next) => {
  // console.log(`📸 Se solicitó la imagen: ${req.path}`);
  next();
}, express.static(uploadsPath));


// Rutas de la API
app.use("/api/auth", authRoutes);

// Middleware para servir el frontend (React/Vite)
const clientPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientPath));

// Ruta principal (React SPA)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/uploads")) {
    console.log("📝 Se solicitó una ruta que no es /uploads:", req.path);
    res.sendFile(path.join(clientPath, "index.html"));
  }
});

// Ruta de prueba
app.get("/panel", (req, res) => {
  console.log("Entra aquí");
});

// Conectar a la base de datos y levantar el servidor
AppDataSource.initialize()
  .then(async () => {
    console.log("📦 Base de datos conectada!");
    console.log("🚀 Ejecutando migraciones...");
    // createAdminUser(); 
    
    await AppDataSource.runMigrations(); // 🔥 Ejecutar migraciones al iniciar
    
    console.log("✅ Migraciones ejecutadas con éxito!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("❌ Error al conectar la base de datos:", error);
    process.exit(1);
  });
