import Withdrawal from "../models/Withdrawal.js";
import PaymentLink from "../models/PaymentLink.js";

export const solicitarSaqueAfiliado = async (req, res) => {
  const { amount, titular, banco, iban } = req.body;
  const userId = req.user._id;

  const comissoesPagas = await PaymentLink.find({
    afiliadoId: userId,
    status: "pago"
  });

  const totalRecebido = comissoesPagas.reduce((sum, l) => sum + (l.valorAfiliado || 0), 0);

  const saques = await Withdrawal.find({
    userId,
    tipo: "afiliado",
    status: { $in: ["pendente", "aprovado"] }
  });

  const totalSacado = saques.reduce((sum, s) => sum + s.amount, 0);
  const saldoDisponivel = totalRecebido - totalSacado;

  if (amount > saldoDisponivel) {
    return res.status(400).json({ message: "Saldo insuficiente para saque de afiliado." });
  }

  const novoSaque = await Withdrawal.create({
    userId,
    amount,
    tipo: "afiliado",
    bankInfo: { titular, banco, iban }
  });

  res.status(201).json({ message: "Saque de afiliado solicitado com sucesso", saque: novoSaque });
};

export const listarMeusSaquesAfiliado = async (req, res) => {
  const saques = await Withdrawal.find({
    userId: req.user._id,
    tipo: "afiliado"
  }).sort({ requestedAt: -1 });

  res.json(saques);
};
