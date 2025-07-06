export const atualizarPlano = async (req, res) => {
    const { plano } = req.body;
    const planosValidos = ["basico", "ouro", "premium"];
  
    if (!planosValidos.includes(plano)) {
      return res.status(400).json({ message: "Plano inválido." });
    }
  
    await User.findByIdAndUpdate(req.user._id, {
      plan: plano,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      linksUsados: 0 // reseta contador
    });
  
    res.json({ message: "Plano atualizado!" });
  };
  export const getPlanoUsuario = async (req, res) => {
    const user = req.user;
  
    res.json({
      plano: user.plan,
      validade: user.planExpiresAt,
      usados: user.linksUsados
    });
  };
  