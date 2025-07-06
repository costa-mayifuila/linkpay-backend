export const verificarLimiteDePlano = async (req, res, next) => {
    const user = req.user;
  
    const limites = {
      basico: 10,
      ouro: 100,
      premium: 9999
    };
  
    const limite = limites[user.plan] || 0;
  
    if (user.linksUsados >= limite) {
      return res.status(403).json({ message: "Limite de links atingido para seu plano atual." });
    }
  
    next();
  };
  export const permitirExportacao = (req, res, next) => {
    const plano = req.user.plan;
  
    if (plano === "basico") {
      return res.status(403).json({ message: "Este recurso está disponível apenas no plano Ouro ou Premium." });
    }
  
    next();
  };
  