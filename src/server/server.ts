import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source"; 
import authRoutes from "../routes/authRoutes"; 

// Configuración del servidor
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);

// Servir archivos estáticos del cliente (React/Vite)
const clientPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientPath));

// Ruta principal (React SPA)
app.get("*", (req, res) => {
  console.log('entrando ruta principal...');
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get('/panel', (req, res) => {
  console.log('Entra aquí');
});


// Conectar a la base de datos y levantar el servidor
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("❌ Error al conectar la base de datos:", error);
    process.exit(1); // Detiene el proceso si la BD falla
  });
