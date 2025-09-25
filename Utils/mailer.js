const nodemailer = require("nodemailer");
const fetch = require("node-fetch");

// More robust SMTP transport with timeouts and pooling
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 15000,
  socketTimeout: 20000,
});

/**
 * Send a simple email
 * Returns { success: boolean, error?: string }
 */
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  // Fallback to SendGrid API if configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.EMAIL_USER },
          subject,
          content: [{ type: "text/plain", value: text }],
        }),
      });
      if (resp.ok) {
        console.log("Email (SendGrid) sent to", to);
        return { success: true };
      }
      const errText = await resp.text();
      return { success: false, error: errText };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error && error.message ? error.message : String(error) };
  }
};

module.exports = sendEmail;
