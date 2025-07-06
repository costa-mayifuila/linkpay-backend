import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assunto: { type: String, required: true },
  status: { type: String, enum: ["aberto", "respondido", "fechado"], default: "aberto" },
  mensagens: [
    {
      texto: String,
      autor: { type: String, enum: ["usuario", "admin"] },
      data: { type: Date, default: Date.now }
    }
  ],
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Ticket", ticketSchema);
