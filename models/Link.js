import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "aguardando" },
  recebidoLiquido: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Link', linkSchema);
