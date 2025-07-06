import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  solicitarSaqueAfiliado,
  listarMeusSaquesAfiliado
} from "../controllers/afiliadoWithdrawalController.js";

const router = express.Router();

router.post("/solicitar", auth, solicitarSaqueAfiliado);
router.get("/meus", auth, listarMeusSaquesAfiliado);

export default router;
