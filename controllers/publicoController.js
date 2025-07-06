import PaymentLink from "../models/PaymentLink.js";

export const rastrearCliqueAfiliado = async (req, res) => {
  const { slug } = req.params;
  const { ref } = req.query;

  const link = await PaymentLink.findOne({ slug });
  if (!link) return res.status(404).json({ message: "Link não encontrado" });

  // se houver referência de afiliado, salvar
  if (ref) {
    link.clicksAfiliado = (link.clicksAfiliado || 0) + 1;
    link.afiliadoId = ref;
    await link.save();
  }

  res.json(link);
};
