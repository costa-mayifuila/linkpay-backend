import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import {
  solicitarSaque,
  listarMeusSaques,
  listarTodosSaques,
  atualizarStatusSaque,
} from "../controllers/withdrawalController.js";

const router = express.Router();

// 🧾 Rotas do usuário autenticado
router.post("/solicitar", auth, solicitarSaque);
router.get("/meus", auth, listarMeusSaques);

// 🛡️ Rotas administrativas
router.get("/admin/todos", auth, isAdmin, listarTodosSaques);
router.put("/admin/:id", auth, isAdmin, atualizarStatusSaque);

export default router;
