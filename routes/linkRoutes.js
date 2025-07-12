import express from 'express';
import { criarLink, listarLinksDoUsuario } from '../controllers/linkController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/criar', authMiddleware, criarLink);
router.get('/me', authMiddleware, listarLinksDoUsuario);

export default router;
