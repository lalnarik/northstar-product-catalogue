import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import type { EnquiryInput, EnquiryMailer } from "../types/enquiry.js";

export class SmtpEnquiryMailer implements EnquiryMailer {
  private readonly transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_USER && env.SMTP_PASSWORD
      ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }
      : {})
  });

  async sendEnquiry(input: EnquiryInput, productTitle: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: env.SALES_INBOX,
      replyTo: input.email,
      subject: `Product enquiry: ${productTitle}`,
      text: [
        `Product: ${productTitle} (ID: ${input.productId})`,
        `Customer: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone || "Not provided"}`,
        "",
        "Message:",
        input.message || "No additional message"
      ].join("\\n")
    });
  }
}