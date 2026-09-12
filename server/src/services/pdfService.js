import PDFDocument from "pdfkit";

function formatEUR(cents) {
  return `€${(cents / 100).toFixed(2)}`;
}

export function generateInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).fillColor("#df1471").text("The Posy", { align: "left" });
    doc.fontSize(10).fillColor("black").text("Belgium's Flower Marketplace");
    doc.moveDown();

    doc.fontSize(14).text(`Invoice — Order ${order.orderNumber}`);
    doc.fontSize(10).text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`);
    doc.text(`Bill to: ${order.contactEmail}`);
    doc.text(
      `Delivery address: ${order.deliveryAddress.street}, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}, ${order.deliveryAddress.country}`
    );
    doc.moveDown();

    doc.fontSize(12).text("Items", { underline: true });
    doc.moveDown(0.5);
    order.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.title}  x${item.quantity}   ${formatEUR(item.priceCents)} each   ${formatEUR(
            item.priceCents * item.quantity
          )}`
        );
    });

    doc.moveDown();
    doc.fontSize(10).text(`Subtotal: ${formatEUR(order.subtotalCents)}`);
    doc.text(`Delivery: ${formatEUR(order.deliveryFeeCents)}`);
    doc.fontSize(12).text(`Total: ${formatEUR(order.totalCents)}`, { underline: true });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("gray").text("Thank you for shopping with The Posy.");

    doc.end();
  });
}
