// 📁 routes/perfilRoutes.js
import express from "express";
import {
  getPerfil,
  atualizarPerfil,
  atualizarSenha,
} from "../controllers/perfilController.js";
import auth from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🔐 Retorna perfil do usuário logado
router.get("/me", auth, getPerfil);

// 🔧 Atualiza perfil do usuário (com avatar opcional)
router.put("/", auth, uploadAvatar.single("avatar"), atualizarPerfil);

// 🔑 Atualiza senha
router.put("/senha", auth, atualizarSenha);

export default router;
