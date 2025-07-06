import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pendente", "aprovado", "recusado"],
    default: "pendente"
  },

  tipo: {
    type: String,
    enum: ["vendedor", "afiliado"],
    default: "vendedor"
  },

  bankInfo: {
    titular: String,
    banco: String,
    iban: String
  },

  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
});

export default mongoose.model("Withdrawal", withdrawalSchema);
