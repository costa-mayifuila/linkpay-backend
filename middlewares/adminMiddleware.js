export const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Acesso restrito ao administrador." });
    }
    next();
  };
  