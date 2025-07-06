import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 📞 Número de telefone (para WhatsApp)
    phone: { type: String, required: false },

    // 🖼️ URL do avatar do usuário
    avatarUrl: { type: String, default: "" },

    // 🔐 Plano do usuário
    plan: {
      type: String,
      enum: ["basico", "ouro", "premium"],
      default: "basico",
    },

    // 📅 Data de expiração do plano
    planExpiresAt: {
      type: Date,
      default: null,
    },

    // 📊 Contador de links usados
    linksUsados: {
      type: Number,
      default: 0,
    },

    // 🛡️ Permissão de administrador
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔒 Criptografar senha antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Método para verificar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
