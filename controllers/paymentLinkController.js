import PaymentLink from "../models/PaymentLink.js";
import User from "../models/User.js";
import slugify from "slugify";
import { calcularTaxaPorPlano } from "../utils/calcularTaxa.js";

// ✅ Criar novo link de pagamento com taxa por plano
export const criarLink = async (req, res) => {
  try {
    const { title, description, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Título e valor são obrigatórios." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "O valor precisa ser um número positivo." });
    }

    // 🔗 Gerar slug único
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let contador = 1;
    while (await PaymentLink.findOne({ slug })) {
      slug = `${baseSlug}-${contador++}`;
    }

    // 🔢 Calcular taxa
    const user = await User.findById(req.user._id);
    const plano = user.plano || "basico";
    const { valorTaxa, valorLiquido } = calcularTaxaPorPlano(plano, amount);

    const novoLink = new PaymentLink({
      title,
      description,
      amount,
      userId: req.user._id,
      slug,
      plano,
      taxaSistema: valorTaxa,
      recebidoLiquido: valorLiquido,
      status: "aguardando",
    });

    await novoLink.save();

    // Atualiza contador de links usados
    await User.findByIdAndUpdate(req.user._id, { $inc: { linksUsados: 1 } });

    res.status(201).json({
      message: "Link de pagamento criado com sucesso!",
      link: `https://seusite.ao/pagar/${novoLink.slug}`,
      data: novoLink,
    });
  } catch (error) {
    console.error("Erro ao criar link:", error);
    res.status(500).json({ message: "Erro interno ao criar o link." });
  }
};

// ✅ Buscar link por slug (público)
export const buscarLinkPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const link = await PaymentLink.findOne({ slug });

    if (!link) {
      return res.status(404).json({ message: "Link não encontrado." });
    }

    res.json(link);
  } catch (error) {
    console.error("Erro ao buscar link:", error);
    res.status(500).json({ message: "Erro ao buscar link." });
  }
};

// ✅ Listar links do usuário autenticado (com paginação)
export const meusLinks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalLinks = await PaymentLink.countDocuments({ userId });
    const linksPaginados = await PaymentLink.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total: totalLinks,
      page,
      totalPages: Math.ceil(totalLinks / limit),
      links: linksPaginados,
    });
  } catch (error) {
    console.error("Erro ao buscar links do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar seus links." });
  }
};

// ✅ Atualizar link
export const atualizarLink = async (req, res) => {
  const { id } = req.params;
  const { title, description, amount } = req.body;

  try {
    const link = await PaymentLink.findById(id);
    if (!link) return res.status(404).json({ message: "Link não encontrado." });

    if (String(link.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Você não tem permissão para editar este link." });
    }

    if (amount && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({ message: "O valor precisa ser um número positivo." });
    }

    link.title = title || link.title;
    link.description = description || link.description;
    link.amount = amount || link.amount;

    await link.save();

    res.json({ message: "Link atualizado com sucesso!", link });
  } catch (error) {
    console.error("Erro ao atualizar link:", error);
    res.status(500).json({ message: "Erro ao atualizar link." });
  }
};

// ✅ Deletar link
export const deletarLink = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await PaymentLink.findById(id);
    if (!link) return res.status(404).json({ message: "Link não encontrado." });

    if (String(link.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Você não tem permissão para excluir este link." });
    }

    await link.deleteOne();
    res.json({ message: "Link deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    res.status(500).json({ message: "Erro ao deletar link." });
  }
};

// ✅ Registrar afiliado no link
export const registrarAfiliado = async (req, res) => {
  const { slug } = req.params;
  const { ref } = req.query;

  try {
    const link = await PaymentLink.findOne({ slug });
    if (!link) return res.status(404).json({ message: "Link não encontrado" });

    if (ref) {
      link.afiliadoId = ref;
      await link.save();
    }

    res.json(link);
  } catch (error) {
    console.error("Erro ao registrar afiliado:", error);
    res.status(500).json({ message: "Erro ao registrar afiliado." });
  }
};

// ✅ Listar produtos disponíveis para afiliado
export const listarProdutosAfiliado = async (req, res) => {
  const { idAfiliado } = req.params;

  try {
    const links = await PaymentLink.find({
      status: "aguardando",
      $or: [
        { afiliadoId: idAfiliado },
        { comissaoAfiliado: { $gt: 0 } }
      ]
    });

    res.json(links);
  } catch (error) {
    console.error("Erro ao listar produtos para afiliado:", error);
    res.status(500).json({ message: "Erro ao listar produtos." });
  }
};
