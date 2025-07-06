import cron from "node-cron";
import User from "../models/User.js";
import PaymentLink from "../models/PaymentLink.js";
import Withdrawal from "../models/Withdrawal.js";
import { enviarEmailNotificacao } from "../utils/emailService.js";

// ⏰ Rodar todo dia 1º às 9h da manhã
cron.schedule("0 9 1 * *", async () => {
  console.log("🧾 Executando envio de resumo mensal...");

  const usuarios = await User.find();

  for (const user of usuarios) {
    const userId = user._id;

    const vendas = await PaymentLink.find({ userId, status: "pago" });
    const comissoes = await PaymentLink.find({ afiliadoId: userId, status: "pago" });
    const saques = await Withdrawal.find({ userId, status: "aprovado" });

    const totalVendas = vendas.reduce((s, v) => s + (v.recebidoLiquido || 0), 0);
    const totalComissoes = comissoes.reduce((s, c) => s + (c.valorAfiliado || 0), 0);
    const totalSacado = saques.reduce((s, s2) => s + s2.amount, 0);
    const saldo = totalVendas + totalComissoes - totalSacado;

    const texto = `
Olá ${user.name},

Segue abaixo o seu resumo financeiro do mês:

🛒 Total recebido por vendas: Kz ${totalVendas.toLocaleString()}
📈 Comissões como afiliado: Kz ${totalComissoes.toLocaleString()}
💸 Total sacado: Kz ${totalSacado.toLocaleString()}
💰 Saldo disponível: Kz ${saldo.toLocaleString()}

Você pode baixar seu relatório detalhado em PDF acessando seu painel.

Atenciosamente,
Equipe LinkPay
    `;

    await enviarEmailNotificacao({
      to: user.email,
      subject: "Resumo Financeiro Mensal 📊",
      text: texto
    });
  }

  console.log("✅ Resumo mensal enviado com sucesso.");
});
