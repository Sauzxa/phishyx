import express, { Request, Response } from "express";
import mailRoutes from "./routes/mail.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Trust reverse proxies so req.ip reflects the real client IP
app.set("trust proxy", true);

app.use(express.json());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "PhishyX server is running",
    endpoints: {
      sendEmail: "POST /api/send-email",
      login: "POST /api/auth/login",
    },
  });
});

// Routes
app.use("/api", mailRoutes);
app.use("/api/auth", authRoutes);

export default app;
