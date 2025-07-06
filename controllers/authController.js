import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Registro
export const registrar = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ message: "Usuário já existe." });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: gerarToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar." });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: gerarToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ message: "Email ou senha inválidos." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer login." });
  }
};
