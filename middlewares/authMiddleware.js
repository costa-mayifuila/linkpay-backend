// 📁 middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    req.user = user;

    console.log("✅ Usuário autenticado:", user.email || user._id); // 👈 para debug

    next();
  } catch (error) {
    console.error("❌ Erro na verificação do token:", error.message);
    return res.status(401).json({ message: "Token inválido." });
  }
};

export default authMiddleware;
