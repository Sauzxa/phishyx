# Express + Nodemailer (TypeScript)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and fill SMTP values:

```bash
cp .env.example .env
```

3. Run in dev mode:

```bash
npm run dev
```

The server runs on `http://localhost:3000`.

## Send email

Endpoint:

```http
POST /ap/send-email
```

Example request:

```bash
curl -X POST http://localhost:3000/ap/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"recipient@example.com","from":"sender@example.com"}'
```

The email body contains random text generated on each request.
