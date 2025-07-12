import Link from '../models/Link.js';

// Função auxiliar para gerar slug
function gerarSlug(titulo) {
  return (
    titulo
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50) +
    "-" +
    Date.now().toString().slice(-4)
  );
}

// ✅ Criar novo link de pagamento
export const criarLink = async (req, res) => {
  try {
    const { title, amount } = req.body;

    // Verifica se o token JWT foi processado e o ID do usuário está no req
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Usuário não autenticado." });

    const slug = gerarSlug(title);

    const novoLink = new Link({
      title,
      amount,
      slug,
      user: userId,
      status: "aguardando",
      recebidoLiquido: 0,
      criadoPor: userId,
    });

    await novoLink.save();

    res.status(201).json({
      success: true,
      message: "Link criado com sucesso!",
      link: novoLink, // ← Aqui o frontend pega o .slug
    });
  } catch (error) {
    console.error("❌ Erro ao criar link:", error);
    res.status(500).json({ message: "Erro ao criar link." });
  }
};
