// 📁 routes/publicoRoutes.js

import express from "express";
import { rastrearCliqueAfiliado } from "../controllers/publicoController.js";
import { listarProdutosAfiliado } from "../controllers/paymentLinkController.js";

const router = express.Router();

// 🔍 Rastrear clique de afiliado no link público
router.get("/:slug", rastrearCliqueAfiliado);

// 🛍️ Listar produtos para afiliado
router.get("/afiliado-page/:idAfiliado", listarProdutosAfiliado);

export default router;
