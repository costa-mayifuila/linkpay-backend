import PaymentLink from "../models/PaymentLink.js";

export const estatisticasAfiliado = async (req, res) => {
  try {
    const userId = req.user._id;

    const comissoesPagas = await PaymentLink.find({
      afiliadoId: userId,
      status: "pago"
    });

    const totalComissao = comissoesPagas.reduce((sum, l) => sum + (l.valorAfiliado || 0), 0);
    const totalLinksAfiliado = comissoesPagas.length;

    const dias = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const chave = d.toLocaleDateString("pt-BR");
      dias[chave] = 0;
    }

    comissoesPagas.forEach(link => {
      const dia = new Date(link.createdAt).toLocaleDateString("pt-BR");
      if (dias[dia] !== undefined) {
        dias[dia] += link.valorAfiliado || 0;
      }
    });

    res.json({
      totalComissao,
      totalLinksAfiliado,
      grafico: dias
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas do afiliado." });
  }
};
