const nodemailer = require("nodemailer");

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
