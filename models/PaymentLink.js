import mongoose from "mongoose";
import slugify from "slugify";

const paymentLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true, min: 0 },
  slug: { type: String, unique: true },
  status: {
    type: String,
    enum: ["aguardando", "pago", "expirado"],
    default: "aguardando",
  },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // 📌 Dados da transação
  transactionDetails: {
    type: Object,
    default: null,
  },

  // 🛒 Produto ou serviço
  isServico: { type: Boolean, default: false },

  // 💰 Comissão da plataforma
  comissaoPercentual: { type: Number, default: 5, min: 0, max: 100 },
  taxaSistema: { type: Number, default: 0, min: 0 },
  recebidoLiquido: { type: Number, default: 0 },

  // 🤝 Afiliado (se houver)
  afiliadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  comissaoAfiliado: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
  valorAfiliado: { type: Number, default: 0 },
  clicksAfiliado: { type: Number, default: 0 },

  // 🗓️ Plano do criador
  plano: {
    type: String,
    enum: ["basico", "ouro", "premium"],
    default: "basico",
  },
});

// 🔗 Gerar slug automaticamente antes de salvar
paymentLinkSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true });
  }
  next();
});

export default mongoose.model("PaymentLink", paymentLinkSchema);
