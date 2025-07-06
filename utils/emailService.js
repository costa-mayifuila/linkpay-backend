import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // pode usar outro provedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarEmailNotificacao = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"LinkPay Notificação" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};
