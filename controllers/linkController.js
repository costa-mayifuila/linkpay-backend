import Link from '../models/Link.js';

// 🔤 Função auxiliar para gerar slug
function gerarSlug(titulo) {
  return (
    titulo
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) +
    '-' +
    Date.now().toString().slice(-4)
  );
}

// ✅ Criar novo link de pagamento
export const criarLink = async (req, res) => {
  try {
    const { title, amount } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const slug = gerarSlug(title);

    const novoLink = new Link({
      title,
      amount,
      slug,
      userId,
      status: 'aguardando',
      recebidoLiquido: 0,
      criadoPor: userId,
    });

    await novoLink.save();

    res.status(201).json({
      success: true,
      message: 'Link criado com sucesso!',
      link: novoLink,
    });
  } catch (error) {
    console.error('❌ Erro ao criar link:', error);
    res.status(500).json({ message: 'Erro ao criar link.' });
  }
};

// ✅ Listar links do usuário logado
export const listarLinksDoUsuario = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const links = await Link.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, links });
  } catch (error) {
    console.error('❌ Erro ao listar links:', error);
    res.status(500).json({ message: 'Erro ao buscar links.' });
  }
};

// ✅ Buscar link de pagamento por slug (rota pública)
export const buscarLinkPublicoPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const link = await Link.findOne({ slug });

    if (!link) {
      return res.status(404).json({ message: 'Link não encontrado.' });
    }

    res.status(200).json(link);
  } catch (error) {
    console.error('❌ Erro ao buscar link público:', error);
    res.status(500).json({ message: 'Erro ao buscar link público.' });
  }
};
