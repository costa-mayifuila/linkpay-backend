import Withdrawal from "../models/Withdrawal.js";
import PaymentLink from "../models/PaymentLink.js";

// 📌 Solicitar novo saque
export const solicitarSaque = async (req, res) => {
  const { amount, titular, banco, iban } = req.body;
  const userId = req.user._id;

  try {
    // 🔍 Buscar todos os links pagos do usuário
    const pagos = await PaymentLink.find({ userId, status: "pago" });
    const totalRecebido = pagos.reduce((s, l) => s + (l.recebidoLiquido || 0), 0);

    // 🔍 Buscar saques pendentes e aprovados
    const saques = await Withdrawal.find({
      userId,
      status: { $in: ["pendente", "aprovado"] },
    });
    const totalSacado = saques.reduce((s, w) => s + w.amount, 0);

    const saldoDisponivel = totalRecebido - totalSacado;

    if (amount > saldoDisponivel) {
      return res.status(400).json({ message: "Saldo insuficiente para saque." });
    }

    // 💰 Criar nova solicitação de saque
    const novoSaque = await Withdrawal.create({
      userId,
      amount,
      status: "pendente",
      bankInfo: { titular, banco, iban },
      requestedAt: new Date(),
    });

    res.status(201).json({ message: "Solicitação de saque enviada!", saque: novoSaque });
  } catch (error) {
    console.error("Erro ao solicitar saque:", error);
    res.status(500).json({ message: "Erro interno ao solicitar saque." });
  }
};

// 📄 Listar os saques do próprio usuário
export const listarMeusSaques = async (req, res) => {
  try {
    const saques = await Withdrawal.find({ userId: req.user._id }).sort({ requestedAt: -1 });
    res.json(saques);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar seus saques." });
  }
};

// 🔒 Apenas para admin: listar todos os saques de todos os usuários
export const listarTodosSaques = async (req, res) => {
  try {
    const saques = await Withdrawal.find()
      .sort({ requestedAt: -1 })
      .populate("userId", "name email phone");
    res.json(saques);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar todos os saques." });
  }
};

// 🔄 Atualizar status de um saque (aprovado/recusado)
export const atualizarStatusSaque = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!["aprovado", "recusado"].includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const saque = await Withdrawal.findById(id);
    if (!saque) return res.status(404).json({ message: "Saque não encontrado." });

    saque.status = status;
    saque.processedAt = new Date();
    await saque.save();

    res.json({ message: `Saque ${status} com sucesso.` });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status do saque." });
  }
};
