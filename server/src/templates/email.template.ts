import crypto from "crypto";

const SUBJECTS = [
  "Your account requires immediate verification",
  "Unusual sign-in activity detected",
  "Action required: Confirm your identity",
  "Important: Your password will expire soon",
  "Security alert: Verify your account now",
  "Your account has been temporarily limited",
  "Urgent: Update your billing information",
];

const BRANDS = [
  { name: "PayPal", color: "#003087", accent: "#009cde" },
  { name: "Google", color: "#4285F4", accent: "#34A853" },
  { name: "Microsoft", color: "#00a4ef", accent: "#ffb900" },
  { name: "Amazon", color: "#FF9900", accent: "#232F3E" },
  { name: "Netflix", color: "#E50914", accent: "#141414" },
];

export function randomSubject(): string {
  return SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
}

export function generateHtmlEmail(): { subject: string; html: string; text: string } {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const subject = randomSubject();
  const token = crypto.randomBytes(16).toString("hex");
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center"
              style="background-color:${brand.color};padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:1px;">
                ${brand.name}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <h2 style="margin:0 0 16px;color:#222222;font-size:20px;">
                ${subject}
              </h2>
              <p style="margin:0 0 16px;color:#555555;font-size:15px;line-height:1.6;">
                We detected unusual activity on your ${brand.name} account. To keep your account
                secure, please verify your identity by clicking the button below.
              </p>
              <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
                If you do not verify within <strong>24 hours</strong>, your access may be
                temporarily suspended.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="border-radius:4px;background-color:${brand.color};">
                    <a href="http://localhost:3000/verify?token=${token}"
                      style="display:inline-block;padding:14px 32px;color:#ffffff;
                             font-size:15px;font-weight:bold;text-decoration:none;
                             border-radius:4px;letter-spacing:0.5px;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Code -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="16" border="0"
                style="background:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;margin-top:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;color:#888888;font-size:12px;text-transform:uppercase;
                               letter-spacing:1px;">
                      Your Security Code
                    </p>
                    <p style="margin:0;color:#222222;font-size:28px;font-weight:bold;
                               letter-spacing:6px;font-family:monospace;">
                      ${code}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;color:#999999;font-size:12px;line-height:1.6;
                         border-top:1px solid #eeeeee;padding-top:20px;">
                If you did not request this email, you can safely ignore it. Do not share your
                security code with anyone. ${brand.name} will never ask for your password.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="background-color:${brand.accent};padding:20px 40px;">
              <p style="margin:0;color:#ffffff;font-size:12px;">
                &copy; ${year} ${brand.name}, Inc. &nbsp;&middot;&nbsp; All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${subject}\n\nWe detected unusual activity on your ${brand.name} account.\n\nYour security code: ${code}\n\nVerify here: http://localhost:3000/verify?token=${token}\n\nIf you did not request this, ignore this email.`;

  return { subject, html, text };
}
