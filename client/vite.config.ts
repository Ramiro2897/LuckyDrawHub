import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración para asegurar que las rutas y el proxy funcionen bien
export default defineConfig({
  plugins: [react()],
  base: "./", // Asegura que funcione bien en diferentes entornos
  server: {
    host: true, // Permitir acceso desde la red
    port: 5173, // Fijar el puerto
    strictPort: true, // No cambiar automáticamente el puerto
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Redirigir las llamadas API al backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
