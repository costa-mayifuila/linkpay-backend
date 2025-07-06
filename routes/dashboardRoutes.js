import express from "express";
import { estatisticasUsuario } from "../controllers/dashboardController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", auth, estatisticasUsuario);
export default router;
