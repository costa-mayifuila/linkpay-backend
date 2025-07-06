import express from "express";
import {
  abrirTicket,
  responderTicket,
  listarTicketsDoUsuario,
  listarTodosTickets
} from "../controllers/ticketController.js";

import auth from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/abrir", auth, abrirTicket);
router.post("/responder/:id", auth, responderTicket);
router.get("/meus", auth, listarTicketsDoUsuario);
router.get("/admin/todos", auth, isAdmin, listarTodosTickets);

export default router;
