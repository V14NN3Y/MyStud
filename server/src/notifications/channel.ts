import { env } from "../env.ts";
export interface NotificationChannel {
  send(to: string, message: string, subject?: string): Promise<void>;
}
export class ConsoleChannel implements NotificationChannel {
  constructor(private readonly label: string) {}
  async send(to: string, message: string): Promise<void> {
    console.log(`[notifications:${this.label}] -> ${to}: ${message}`);
  }
}
// Real e-mail sending via Resend (https://resend.com/docs/api-reference/emails/send-email).
// Uses a plain fetch call rather than the `resend` SDK — one POST request
// doesn't need a whole extra dependency.
export class ResendEmailChannel implements NotificationChannel {
  constructor(
    private readonly apiKey: string,
    private readonly from: string
  ) {}
  async send(to: string, message: string, subject = "Notification MyStud"): Promise<void> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from: this.from, to, subject, text: message }),
    });
    if (!res.ok) {
      // Never log the API key; the response body already says what went
      // wrong (unverified domain, bad "from" address, invalid key, ...).
      const body = await res.text().catch(() => "");
      throw new Error(`Resend a refusé l'envoi (${res.status}): ${body}`);
    }
  }
}
// Example of what a real SMS adapter's shape would be (left unimplemented —
// Resend only covers e-mail; SMS still needs a separate provider like
// Twilio, see server/README.md "Canaux SMS/e-mail"):
//
// export class TwilioSmsChannel implements NotificationChannel {
//   constructor(private readonly accountSid: string, private readonly authToken: string, private readonly from: string) {}
//   async send(to: string, message: string): Promise<void> {
//     // POST https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json
//   }
// }
export const smsChannel: NotificationChannel = new ConsoleChannel("sms");
export const emailChannel: NotificationChannel = env.resendApiKey
  ? new ResendEmailChannel(env.resendApiKey, env.resendFromEmail)
  : new ConsoleChannel("email");
