// controllers/userController.js
import User from "../models/User.js"; // Certifique-se de importar o modelo de usuário correto

// Função para atualizar o plano do usuário
export const atualizarPlano = async (req, res) => {
  try {
    const { plano } = req.body; // Supondo que o plano seja passado no corpo da requisição
    const userId = req.user.id; // A ID do usuário vem do middleware de autenticação (authMiddleware)

    // Atualiza o plano do usuário no banco de dados
    const user = await User.findByIdAndUpdate(userId, { plano }, { new: true });

    res.json({
      success: true,
      message: "Plano atualizado com sucesso",
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Erro ao atualizar o plano",
      error: err.message,
    });
  }
};

// Função para obter o plano do usuário
export const getPlanoUsuario = async (req, res) => {
  try {
    const userId = req.user.id; // A ID do usuário vem do middleware de autenticação (authMiddleware)

    // Busca o usuário no banco de dados e retorna o plano
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    res.json({
      success: true,
      plano: user.plano, // Retorna apenas o plano do usuário
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Erro ao obter o plano do usuário",
      error: err.message,
    });
  }
};
