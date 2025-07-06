import PaymentLink from "../models/PaymentLink.js";
import Withdrawal from "../models/Withdrawal.js";

// ✅ Extrato financeiro (com filtro de data opcional)
export const getExtrato = async (req, res) => {
  const userId = req.user._id;
  const { de, ate } = req.query;

  const inicio = de ? new Date(de) : new Date("2000-01-01");
  const fim = ate ? new Date(ate) : new Date();
  fim.setHours(23, 59, 59, 999); // fim do dia

  try {
    // 🟢 Vendas como vendedor
    const vendas = await PaymentLink.find({
      userId,
      status: "pago",
      createdAt: { $gte: inicio, $lte: fim },
    });

    // 🔵 Comissões como afiliado
    const comissoes = await PaymentLink.find({
      afiliadoId: userId,
      status: "pago",
      createdAt: { $gte: inicio, $lte: fim },
    });

    // 🟡 Saques aprovados no período
    const saques = await Withdrawal.find({
      userId,
      status: "aprovado",
      requestedAt: { $gte: inicio, $lte: fim },
    });

    // 💰 Totais
    const totalVendas = vendas.reduce((s, v) => s + (v.recebidoLiquido || 0), 0);
    const totalComissoes = comissoes.reduce((s, c) => s + (c.valorAfiliado || 0), 0);
    const totalSacado = saques.reduce((s, s2) => s + s2.amount, 0);
    const saldo = totalVendas + totalComissoes - totalSacado;

    // 📦 Resposta
    res.json({
      totalRecebidoVendas: totalVendas,
      totalComissoes,
      totalSacado,
      saldoDisponivel: saldo,
      totalTaxasSistema: vendas.reduce((sum, v) => sum + (v.taxaSistema || 0), 0),
      ultimasVendas: vendas,
      ultimasComissoes: comissoes
    });
    

  } catch (error) {
    console.error("Erro ao gerar extrato:", error);
    res.status(500).json({ message: "Erro ao gerar extrato." });
  }
};
