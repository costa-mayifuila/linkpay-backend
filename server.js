// 📁 server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// 🛣️ Rotas
import authRoutes from "./routes/authRoutes.js";
import paymentLinkRoutes from "./routes/paymentLinkRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import afiliadoRoutes from "./routes/afiliadoRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import afiliadoWithdrawalRoutes from "./routes/afiliadoWithdrawalRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import relatorioUsuarioRoutes from "./routes/relatorioUsuarioRoutes.js";
import publicoRoutes from "./routes/publicoRoutes.js";
import extratoRoutes from "./routes/extratoRoutes.js";
import "./jobs/resumoMensalJob.js";

dotenv.config();

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Acesso a arquivos públicos
app.use("/uploads", express.static("uploads"));

// 🔐 Rotas da aplicação
app.use("/api/auth", authRoutes);
app.use("/api/links", paymentLinkRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/saques", withdrawalRoutes);
app.use("/api/afiliados", afiliadoRoutes);
app.use("/api/suporte", ticketRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/afiliados/saques", afiliadoWithdrawalRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/relatorio", relatorioUsuarioRoutes);
app.use("/api/publico", publicoRoutes);
app.use("/api/extrato", extratoRoutes);

// 🏁 Rota inicial de teste
app.get("/", (req, res) => {
  res.send("API LinkPay funcionando!");
});

// 🔌 Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no MongoDB:", err.message);
  });
