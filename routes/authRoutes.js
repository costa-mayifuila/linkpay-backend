// 📁 routes/authRoutes.js

import express from "express";
import { registrar, login } from "../controllers/authController.js";

const router = express.Router();

// 📌 Rotas de autenticação
router.post("/register", registrar);
router.post("/login", login);

export default router;
