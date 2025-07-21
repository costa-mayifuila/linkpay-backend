import express from 'express';
import {
  criarLink,
  listarLinksDoUsuario,
  buscarLinkPublicoPorSlug
} from '../controllers/linkController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Rotas protegidas
router.post('/criar', authMiddleware, criarLink);
router.get('/me', authMiddleware, listarLinksDoUsuario);

// 🌐 Rota pública para acessar link pelo slug
router.get('/:slug', buscarLinkPublicoPorSlug);

export default router;
