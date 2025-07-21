import axios from "axios";
import dotenv from "dotenv";
import PaymentLink from "../models/PaymentLink.js";
import User from "../models/User.js";
import { enviarEmailNotificacao } from "../utils/emailService.js";
import { enviarWhatsApp } from "../utils/whatsappService.js";

dotenv.config();

// 📌 Gerar token para pagamento de um link individual
export const solicitarToken = async (req, res) => {
  const {
    reference,
    amount,
    afiliadoId,
    nomeCliente,
    emailCliente,
    whatsappCliente,
  } = req.body;

  if (!reference || !amount || !nomeCliente || !emailCliente || !whatsappCliente) {
    return res.status(400).json({
      message: "Todos os campos são obrigatórios: referência, valor, nome, e-mail e WhatsApp.",
    });
  }

  try {
    // ✅ Solicita frameToken da EMIS
    const emisResponse = await axios.post(
      "https://pagamentonline.emis.co.ao/online-payment-gateway/webframe/v1/frameToken",
      {
        reference,
        amount,
        token: process.env.EMIS_FRAME_TOKEN,
        terminalId: process.env.EMIS_TERMINAL_ID,
        qrCode: "PAYMENT",
        mobile: "PAYMENT",
        callbackUrl: `https://seusite.ao/api/payment/callback/${reference}`,
      }
    );

    const frameToken = emisResponse.data.token;
    const frameUrl = `https://pagamentonline.emis.co.ao/online-payment-gateway/webframe?frameToken=${frameToken}`;

    // ✅ Registra afiliado no link, se houver
    if (afiliadoId) {
      await PaymentLink.findOneAndUpdate({ slug: reference }, { afiliadoId });
    }

    // ✅ Salva os dados do cliente no link
    await PaymentLink.findOneAndUpdate(
      { slug: reference },
      {
        nomeCliente,
        emailCliente,
        whatsappCliente,
      },
      { new: true }
    );

    return res.json({ frameUrl, token: frameToken });
  } catch (error) {
    console.error("Erro ao solicitar token da EMIS:", error.response?.data || error.message);
    return res.status(500).json({ message: "Erro ao solicitar token da EMIS" });
  }
};

// 📌 Processar callback de pagamento
export const processarCallback = async (req, res) => {
  const { reference } = req.params;
  const transactionData = req.body;

  try {
    if (reference.startsWith("plano-")) {
      const [_, plano, userId] = reference.split("-");
      const planosValidos = ["basico", "ouro", "premium"];

      if (!planosValidos.includes(plano)) {
        return res.status(400).json({ message: "Plano desconhecido." });
      }

      await User.findByIdAndUpdate(userId, {
        plan: plano,
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        linksUsados: 0,
      });

      return res.status(200).json({ message: "Plano atualizado com sucesso!" });
    }

    const link = await PaymentLink.findOne({ slug: reference });
    if (!link) return res.status(404).json({ message: "Link de pagamento não encontrado." });

    if (transactionData.status === "SUCCESS") {
      const comissaoPlataforma = (link.amount * (link.comissaoPercentual || 0)) / 100;
      let valorAfiliado = 0;
      if (link.afiliadoId) {
        valorAfiliado = (link.amount * (link.comissaoAfiliado || 0)) / 100;
      }

      const valorFinalRecebido = link.amount - comissaoPlataforma - valorAfiliado;

      link.status = "pago";
      link.recebidoLiquido = valorFinalRecebido;
      link.valorAfiliado = valorAfiliado;
      link.transactionDetails = transactionData;
      await link.save();

      const user = await User.findById(link.userId);
      if (user?.email) {
        await enviarEmailNotificacao({
          to: user.email,
          subject: "Pagamento Recebido!",
          text: `Olá ${user.name}, você recebeu um pagamento de Kz ${link.amount.toLocaleString()} referente ao link: ${link.title}. Valor líquido: Kz ${valorFinalRecebido.toLocaleString()}.`,
        });
      }

      if (user?.phone) {
        await enviarWhatsApp({
          numero: user.phone,
          mensagem: `Olá ${user.name}, você recebeu um pagamento de Kz ${link.amount.toLocaleString()} referente ao link "${link.title}".`,
        });
      }

      if (link.afiliadoId && valorAfiliado > 0) {
        const afiliado = await User.findById(link.afiliadoId);
        if (afiliado?.phone) {
          await enviarWhatsApp({
            numero: afiliado.phone,
            mensagem: `Parabéns ${afiliado.name}! Você ganhou Kz ${valorAfiliado.toLocaleString()} como comissão por um link seu.`,
          });
        }
      }
    }

    return res.status(200).json({ message: "Callback processado com sucesso." });
  } catch (error) {
    console.error("Erro ao processar callback:", error);
    return res.status(500).json({ message: "Erro ao processar callback." });
  }
};

// 📌 Gerar token para pagamento de plano
export const solicitarTokenPlano = async (req, res) => {
  const { plano } = req.body;
  const user = req.user;

  const planos = {
    basico: 750,
    ouro: 5750,
    premium: 11750,
  };

  if (!planos[plano]) {
    return res.status(400).json({ message: "Plano inválido." });
  }

  const reference = `plano-${plano}-${user._id}`;
  const amount = planos[plano];

  try {
    const response = await axios.post(
      "https://pagamentonline.emis.co.ao/online-payment-gateway/webframe/v1/frameToken",
      {
        reference,
        amount,
        token: process.env.EMIS_FRAME_TOKEN,
        terminalId: process.env.EMIS_TERMINAL_ID,
        qrcode: "PAYMENT",
        mobile: "PAYMENT",
        callbackUrl: `https://seusite.ao/api/payment/callback/${reference}`,
      }
    );

    const frameToken = response.data.token;
    const frameUrl = `https://pagamentonline.emis.co.ao/online-payment-gateway/webframe?frameToken=${frameToken}`;

    return res.json({ frameUrl });
  } catch (error) {
    console.error("Erro ao solicitar token de plano:", error.response?.data || error.message);
    return res.status(500).json({ message: "Erro ao iniciar pagamento" });
  }
};
