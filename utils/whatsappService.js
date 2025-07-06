import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const instanceId = process.env.ZAPI_INSTANCE_ID;
const token = process.env.ZAPI_TOKEN;

export const enviarWhatsApp = async ({ numero, mensagem }) => {
  try {
    await axios.post(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
      phone: numero,
      message: mensagem
    });
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error.response?.data || error.message);
  }
};
