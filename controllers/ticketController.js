import Ticket from "../models/Ticket.js";

export const abrirTicket = async (req, res) => {
  const { assunto, mensagem } = req.body;
  const novoTicket = await Ticket.create({
    userId: req.user._id,
    assunto,
    mensagens: [{ texto: mensagem, autor: "usuario" }]
  });

  res.status(201).json(novoTicket);
};

export const responderTicket = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(404).json({ message: "Ticket não encontrado" });

  ticket.mensagens.push({ texto, autor: req.user.isAdmin ? "admin" : "usuario" });

  if (req.user.isAdmin) ticket.status = "respondido";
  await ticket.save();

  res.json(ticket);
};

export const listarTicketsDoUsuario = async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id });
  res.json(tickets);
};

export const listarTodosTickets = async (req, res) => {
  const tickets = await Ticket.find().populate("userId", "email name");
  res.json(tickets);
};
