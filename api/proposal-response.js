
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { answer } = req.body || {};

  if (!["yes", "moment"].includes(answer)) {
    return res.status(400).json({
      error: "Invalid response",
    });
  }

  if (!process.env.RESEND_API_KEY ||
      !process.env.NOTIFY_EMAIL) {
    return res.status(500).json({
      error: "Email service not configured",
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const responseText =
    answer === "yes"
      ? "YES, FOREVER! ❤️"
      : "I NEED A MOMENT";

  try {
    const { data, error } = await resend.emails.send({
      from: "Shreya Proposal <onboarding@resend.dev>",
      to: [process.env.NOTIFY_EMAIL],
      subject: "Shreya has responded to your proposal ❤️",
      text: `Shreya submitted her response:

${responseText}

Website: https://prachishreya.vercel.app/

— Srikant`,
    });

    if (error) {
      console.error(error);
      return res.status(502).json({
        error: "Email sending failed",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
