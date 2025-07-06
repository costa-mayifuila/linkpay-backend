import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import {
  listarUsuarios,
  listarLinks,
  trocarPlanoUsuario
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/usuarios", auth, isAdmin, listarUsuarios);
router.get("/links", auth, isAdmin, listarLinks);
router.put("/usuarios/:id/plano", auth, isAdmin, trocarPlanoUsuario);

export default router;
