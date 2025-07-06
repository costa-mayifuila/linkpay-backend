// 📁 routes/relatorioRoutes.js

import express from "express";
import { gerarPDF, gerarExcel } from "../controllers/relatorioController.js";
import auth from "../middlewares/authMiddleware.js";
import { permitirExportacao } from "../middlewares/planMiddleware.js"; // você pode adicionar `verificarLimiteDePlano` se precisar

const router = express.Router();

// ✅ Exportação protegida por autenticação e verificação de plano
router.get("/pdf", auth, permitirExportacao, gerarPDF);
router.get("/excel", auth, permitirExportacao, gerarExcel);

export default router;
