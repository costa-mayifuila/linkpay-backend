import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getPerfil = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const atualizarPerfil = async (req, res) => {
  const { name, email, phone } = req.body;

  const user = await User.findById(req.user._id);
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  if (req.file) {
    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();

  res.json({ message: "Perfil atualizado!", user });
};

export const atualizarSenha = async (req, res) => {
  const { atual, nova } = req.body;
  const user = await User.findById(req.user._id);

  const valida = await bcrypt.compare(atual, user.password);
  if (!valida) return res.status(400).json({ message: "Senha atual incorreta" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(nova, salt);

  await user.save();
  res.json({ message: "Senha atualizada com sucesso!" });
};
