import express from "express";
import { gerarRelatorioPDF, gerarRelatorioExcel } from "../controllers/relatorioUsuarioController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/pdf", auth, gerarRelatorioPDF);
router.get("/excel", auth, gerarRelatorioExcel);

export default router;
