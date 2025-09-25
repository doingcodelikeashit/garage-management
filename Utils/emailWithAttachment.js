const nodemailer = require("nodemailer");
const fetch = require("node-fetch");

// Robust SMTP transport, configurable via env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 15000,
  socketTimeout: 20000,
  tls: {
    // Allow self-signed if provider rewrites certs; can be toggled via env
    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH ? process.env.SMTP_REJECT_UNAUTH === "true" : true,
  },
});

// Send email with PDF attachment
const sendEmailWithAttachment = async (to, subject, text, pdfBuffer, filename = "invoice.pdf") => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: filename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  // Fallback to SendGrid API if configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const base64 = pdfBuffer.toString('base64');
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
          attachments: [
            {
              content: base64,
              filename,
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
        }),
      });
      if (resp.ok) {
        console.log("Email with attachment (SendGrid) sent to", to);
        return { success: true, message: "Email sent successfully" };
      }
      const errText = await resp.text();
      return { success: false, error: errText };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email with PDF attachment sent to", to);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error && error.message ? error.message : String(error) };
  }
};

// Send simple email (existing functionality)
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error && error.message ? error.message : String(error) };
  }
};

module.exports = { sendEmailWithAttachment, sendEmail };
