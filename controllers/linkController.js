import Link from '../models/Link.js'; // ou o nome do seu modelo de link
import { Request, Response } from 'express';

export const listarLinksDoUsuario = async (req = Request, res = Response) => {
  try {
    // Pega o ID do usuário logado, que estará disponível depois da autenticação
    const usuarioId = req.user.id; // Aqui é esperado que o middleware de autenticação tenha atribuído o usuário ao objeto req

    // Busca todos os links associados ao usuário logado
    const links = await Link.find({ user: usuarioId }); // Ajuste conforme o modelo do seu Link

    if (!links.length) {
      return res.status(404).json({ message: 'Nenhum link encontrado para o usuário' });
    }

    // Retorna os links encontrados
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar os links' });
  }
};
