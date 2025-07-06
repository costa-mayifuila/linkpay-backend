import express from "express";
import { getExtrato } from "../controllers/extratoController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", auth, getExtrato);

export default router;
