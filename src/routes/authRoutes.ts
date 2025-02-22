import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  console.log('hizo la peticion para el login...')
  await login(req, res);
});

export default router;
