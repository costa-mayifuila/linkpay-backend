import express from "express";
import { estatisticasAdmin } from "../controllers/adminDashboardController.js";
import auth from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();
router.get("/", auth, isAdmin, estatisticasAdmin);

export default router;
