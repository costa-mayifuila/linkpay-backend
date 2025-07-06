import User from "../models/User.js";
import PaymentLink from "../models/PaymentLink.js";

export const listarUsuarios = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const listarLinks = async (req, res) => {
  const links = await PaymentLink.find().populate("userId", "email name");
  res.json(links);
};

export const trocarPlanoUsuario = async (req, res) => {
  const { plano } = req.body;
  const { id } = req.params;

  await User.findByIdAndUpdate(id, {
    plan: plano,
    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    linksUsados: 0
  });

  res.json({ message: "Plano do usuário atualizado com sucesso." });
};
