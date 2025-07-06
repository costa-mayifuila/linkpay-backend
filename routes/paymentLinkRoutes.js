import express from "express";
import {
  criarLink,
  buscarLinkPorSlug,
  atualizarLink,
  deletarLink,
  registrarAfiliado,
  meusLinks,
} from "../controllers/paymentLinkController.js";

import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Rotas protegidas devem vir antes da rota dinâmica
router.get("/me", auth, meusLinks);
router.post("/criar", auth, criarLink);
router.put("/:id", auth, atualizarLink);
router.delete("/:id", auth, deletarLink);

// 🌐 Público (afiliado)
router.get("/publico/:slug", registrarAfiliado);

// ⚠️ Rota dinâmica deve vir por último
router.get("/:slug", buscarLinkPorSlug);

export default router;
