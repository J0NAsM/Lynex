import { buildIntakeEmail } from "@/lib/server/intake-email";
import {
  claimDueIntakes,
  loadIntake,
  markIntakeFailed,
  markIntakeSent,
} from "@/lib/server/intake-db";

const EMAIL_TIMEOUT_MS = 20_000;

async function sendIntake(id: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const recipients = (process.env.CONTACT_TO_EMAIL || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!apiKey || !from || !recipients.length) {
    throw new Error("Email delivery is not configured");
  }

  const intake = await loadIntake(id);
  if (!intake) throw new Error("Saved intake could not be loaded");
  const email = buildIntakeEmail(intake);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `lynex-intake-${id}`,
      "User-Agent": "Lynex Intake/1.0",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: String(intake.answers.contactEmail),
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: intake.files.map((file) => ({
        filename: file.name,
        content: file.content.toString("base64"),
      })),
    }),
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Email provider returned ${response.status}: ${detail}`);
  }
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("Email provider did not return a delivery identifier");
  await markIntakeSent(id, result.id);
}

export async function processIntakeOutbox(limit = 10, requestId?: string) {
  const claimed = await claimDueIntakes(limit, requestId);
  let sent = 0;
  let failed = 0;
  for (const id of claimed) {
    try {
      await sendIntake(id);
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error(`Intake email failed for ${id}`);
      try {
        await markIntakeFailed(id, error);
      } catch {
        console.error(`Could not update retry state for ${id}`);
      }
    }
  }
  return { processed: claimed.length, sent, failed };
}
