import { Router } from "express";
import { emailChannel, smsChannel } from "../notifications/channel.ts";
import { requireRole, ROLES } from "../auth.ts";
export const notificationsRouter = Router();
notificationsRouter.post("/send", requireRole(...ROLES), async (req, res) => {
  const { to, message, subject, channel } = req.body ?? {};
  if (typeof to !== "string" || !to.trim() || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "'to' et 'message' sont requis." });
    return;
  }
  if (channel !== "email" && channel !== "sms") {
    res.status(400).json({ error: "'channel' doit valoir 'email' ou 'sms'." });
    return;
  }
  try {
    const target = channel === "email" ? emailChannel : smsChannel;
    await target.send(to, message, typeof subject === "string" ? subject : undefined);
    res.status(202).json({ sent: true, channel });
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
});
