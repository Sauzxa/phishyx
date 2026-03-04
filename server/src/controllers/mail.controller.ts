import { Request, Response } from "express";
import { sendMail } from "../services/mailer.service";
import { generateHtmlEmail } from "../templates/email.template";

export async function sendEmailController(req: Request, res: Response): Promise<Response> {
  const to = req.body?.to ?? process.env.MAIL_TO;
  const from = req.body?.from ?? process.env.MAIL_FROM ?? process.env.SMTP_USER;

  if (!to || !from) {
    return res.status(400).json({
      error: "Missing recipient/sender. Set to/from in request body or MAIL_TO/MAIL_FROM env vars.",
    });
  }

  const { subject, html, text } = generateHtmlEmail();
  const emailSubject: string = req.body?.subject ?? subject;

  try {
    const info = await sendMail({ from, to, subject: emailSubject, html, text });

    return res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
      subject: emailSubject,
      sentTo: to,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Failed to send email", details });
  }
}
