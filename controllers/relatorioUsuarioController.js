import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import PaymentLink from "../models/PaymentLink.js";

export const gerarRelatorioPDF = async (req, res) => {
  const userId = req.user._id;

  const links = await PaymentLink.find({
    $or: [{ userId }, { afiliadoId: userId }]
  }).sort({ createdAt: -1 });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

  doc.pipe(res);
  doc.fontSize(16).text("Relatório de Transações", { align: "center" });
  doc.moveDown();

  links.forEach((link, i) => {
    doc.fontSize(12).text(`#${i + 1}`);
    doc.text(`Título: ${link.title}`);
    doc.text(`Valor: Kz ${link.amount}`);
    doc.text(`Status: ${link.status}`);
    doc.text(`Recebido (Vendedor): Kz ${link.recebidoLiquido || 0}`);
    doc.text(`Comissão (Afiliado): Kz ${link.valorAfiliado || 0}`);
    doc.text(`Data: ${new Date(link.createdAt).toLocaleString()}`);
    doc.moveDown();
  });

  doc.end();
};

export const gerarRelatorioExcel = async (req, res) => {
  const userId = req.user._id;

  const links = await PaymentLink.find({
    $or: [{ userId }, { afiliadoId: userId }]
  }).sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Relatório");

  sheet.columns = [
    { header: "Título", key: "title" },
    { header: "Valor (Kz)", key: "amount" },
    { header: "Status", key: "status" },
    { header: "Recebido (Kz)", key: "recebido" },
    { header: "Comissão (Kz)", key: "comissao" },
    { header: "Data", key: "data" }
  ];

  links.forEach(link => {
    sheet.addRow({
      title: link.title,
      amount: link.amount,
      status: link.status,
      recebido: link.recebidoLiquido || 0,
      comissao: link.valorAfiliado || 0,
      data: new Date(link.createdAt).toLocaleString()
    });
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};
