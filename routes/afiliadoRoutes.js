// 📁 routes/afiliadoRoutes.js

import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { estatisticasAfiliado } from "../controllers/afiliadoController.js";
import PaymentLink from "../models/PaymentLink.js";

const router = express.Router();

// 📌 Listar todas as comissões já ganhas (links pagos com afiliadoId)
router.get("/minhas-comissoes", auth, async (req, res) => {
  try {
    const comissoes = await PaymentLink.find({
      afiliadoId: req.user._id,
      status: "pago",
    }).sort({ createdAt: -1 });

    res.json(comissoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar comissões." });
  }
});

// 📊 Estatísticas do afiliado (ganhos totais, número de links, etc.)
router.get("/estatisticas", auth, estatisticasAfiliado);

export default router;
