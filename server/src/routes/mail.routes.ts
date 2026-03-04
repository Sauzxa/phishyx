import { Router } from "express";
import { sendEmailController } from "../controllers/mail.controller";

const router = Router();

router.post("/send-email", sendEmailController);

export default router;
