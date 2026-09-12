import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporterPromise;

// Uses real SMTP creds when configured; otherwise falls back to a free
// Ethereal test account so invoice email works out of the box in dev.
function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = env.smtp.host
      ? Promise.resolve(
          nodemailer.createTransport({
            host: env.smtp.host,
            port: env.smtp.port,
            secure: env.smtp.port === 465,
            auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
          })
        )
      : nodemailer.createTestAccount().then((testAccount) =>
          nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
          })
        );
  }
  return transporterPromise;
}

export async function sendInvoiceEmail(order, pdfBuffer) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: env.emailFrom,
    to: order.contactEmail,
    subject: `The Posy — Invoice for order ${order.orderNumber}`,
    text: `Thank you for your order! Your order ${order.orderNumber} total is €${(
      order.totalCents / 100
    ).toFixed(2)}. Your invoice is attached.`,
    attachments: [
      {
        filename: `invoice-${order.orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Invoice email preview: ${previewUrl}`);
  }

  return info;
}
