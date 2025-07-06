import User from "../models/User.js";
import PaymentLink from "../models/PaymentLink.js";
import Withdrawal from "../models/Withdrawal.js";

export const estatisticasAdmin = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalLinks = await PaymentLink.countDocuments();
    const linksPagos = await PaymentLink.find({ status: "pago" });

    const totalRecebido = linksPagos.reduce((sum, l) => sum + (l.recebidoLiquido || 0), 0);
    const totalComissaoAfiliados = linksPagos.reduce((sum, l) => sum + (l.valorAfiliado || 0), 0);

    const totalSaques = await Withdrawal.countDocuments();
    const saquesAprovados = await Withdrawal.find({ status: "aprovado" });
    const valorTotalSacado = saquesAprovados.reduce((sum, s) => sum + s.amount, 0);

    // Gráfico de recebimento por dia (últimos 7 dias)
    const dias = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const chave = d.toLocaleDateString("pt-BR");
      dias[chave] = 0;
    }

    linksPagos.forEach(link => {
      const dia = new Date(link.createdAt).toLocaleDateString("pt-BR");
      if (dias[dia] !== undefined) {
        dias[dia] += link.recebidoLiquido || 0;
      }
    });

    res.json({
      totalUsuarios,
      totalLinks,
      totalRecebido,
      totalComissaoAfiliados,
      totalSaques,
      valorTotalSacado,
      grafico: dias
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao gerar estatísticas do admin." });
  }
};
