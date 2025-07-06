// 📁 routes/paymentRoutes.js

import express from "express";
import {
  solicitarToken,
  solicitarTokenPlano,
  processarCallback
} from "../controllers/paymentController.js";
import { meusLinks } from "../controllers/paymentLinkController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ ROTAS PÚBLICAS
router.post("/solicitar-token", solicitarToken); // Link individual
router.post("/callback/:reference", processarCallback); // Callback da EMIS

// ✅ ROTAS PROTEGIDAS (usuário logado)
router.post("/solicitar-token-plano", authMiddleware, solicitarTokenPlano); // Plano pago
router.get("/me", authMiddleware, meusLinks); // Ver meus links

export default router;
