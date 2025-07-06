import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import PaymentLink from "../models/PaymentLink.js";

// PDF
export const gerarPDF = async (req, res) => {
  try {
    const links = await PaymentLink.find({ userId: req.user._id });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

    doc.pipe(res);

    doc.fontSize(16).text("Relatório de Links de Pagamento", { align: "center" });
    doc.moveDown();

    links.forEach((link, i) => {
      doc.fontSize(12).text(`#${i + 1}`);
      doc.text(`Título: ${link.title}`);
      doc.text(`Valor: Kz ${link.amount}`);
      doc.text(`Status: ${link.status}`);
      doc.text(`Data: ${new Date(link.createdAt).toLocaleString()}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar PDF" });
  }
};

// Excel
export const gerarExcel = async (req, res) => {
  try {
    const links = await PaymentLink.find({ userId: req.user._id });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Links de Pagamento");

    sheet.columns = [
      { header: "Título", key: "title" },
      { header: "Valor (Kz)", key: "amount" },
      { header: "Status", key: "status" },
      { header: "Criado em", key: "createdAt" },
    ];

    links.forEach(link => {
      sheet.addRow({
        title: link.title,
        amount: link.amount,
        status: link.status,
        createdAt: new Date(link.createdAt).toLocaleString(),
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar Excel" });
  }
};
