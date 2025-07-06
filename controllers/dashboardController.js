import PaymentLink from "../models/PaymentLink.js";

export const estatisticasUsuario = async (req, res) => {
  const userId = req.user._id;

  try {
    const links = await PaymentLink.find({ userId });

    const totalLinks = links.length;
    const pagos = links.filter(link => link.status === "pago");
    const totalRecebido = pagos.reduce((sum, l) => sum + (l.recebidoLiquido || 0), 0);

    // Gráfico últimos 7 dias
    const dias = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const chave = d.toLocaleDateString("pt-BR");
      dias[chave] = 0;
    }

    pagos.forEach(link => {
      const dia = new Date(link.createdAt).toLocaleDateString("pt-BR");
      if (dias[dia] !== undefined) {
        dias[dia] += link.recebidoLiquido || 0;
      }
    });

    res.json({
      totalLinks,
      totalPagos: pagos.length,
      totalRecebido,
      grafico: dias
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar estatísticas." });
  }
};
