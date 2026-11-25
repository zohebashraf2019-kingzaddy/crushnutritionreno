// Vercel serverless function: POST /api/contact
// Env vars (Vercel → Settings → Environment Variables):
//   GMAIL_USER          Gmail address that sends the mail
//   GMAIL_APP_PASSWORD  16-char Google App Password for that account
//   CONTACT_TO          where messages are delivered (defaults to GMAIL_USER)
const nodemailer = require("nodemailer");

const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "Method not allowed" }); }
  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const { name = "", email = "", phone = "", topic = "General question", message = "", company = "" } = body;

  if (company) return res.status(200).json({ ok: true }); // honeypot: silently drop bots
  if (!name.trim() || !message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: "Name, a valid email and a message are required." });
  if (name.length > 120 || email.length > 200 || phone.length > 40 || topic.length > 80 || message.length > 5000) return res.status(400).json({ ok: false, error: "Message too long." });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return res.status(500).json({ ok: false, error: "Email is not configured yet." });

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
    await transporter.sendMail({
      from: `"Crush Website" <${GMAIL_USER}>`,
      to: CONTACT_TO || GMAIL_USER,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `🥤 New website message: ${topic} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nTopic: ${topic}\n\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px">
        <h2 style="background:#ebe14c;padding:14px 18px;margin:0;border:3px solid #0b0b0f">New message from crushnutritionreno.com</h2>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:6px 0;font-weight:bold;width:90px">Name</td><td>${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone</td><td>${esc(phone) || "-"}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Topic</td><td>${esc(topic)}</td></tr>
        </table>
        <div style="white-space:pre-wrap;background:#f6f6f6;padding:14px;border-left:4px solid #2e47b8">${esc(message)}</div>
        <p style="color:#777;font-size:12px">Hit reply to answer ${esc(name)} directly.</p></div>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact send failed", err);
    return res.status(500).json({ ok: false, error: "Could not send right now." });
  }
};
