const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary").v2;
const twilio = require("twilio");

// 🧾 Sample Bill JSON
const billData = {
  invoiceNo: "INV-1004",
  date: "2025-05-22",
  customer: { name: "Rahul Verma", email: "rahul@example.com" },
  items: [
    { description: "Wheel Alignment", qty: 1, price: 100 },
    { description: "Brake Pads", qty: 2, price: 80 },
  ],
  total: 260,
};

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

// ✅ Twilio Config
const twilioClient = twilio(
  "your_twilio_account_sid",
  "your_twilio_auth_token"
);
const TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox

// ✅ Step 1: Generate PDF
async function generatePDF(data) {
  const templatePath = path.join(__dirname, "invoice-template.ejs");
  const html = await ejs.renderFile(templatePath, data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfPath = path.join(__dirname, `${data.invoiceNo}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4" });
  await browser.close();

  return pdfPath;
}

// ✅ Step 2: Upload to Cloudinary
async function uploadToCloudinary(pdfPath) {
  const result = await cloudinary.uploader.upload(pdfPath, {
    resource_type: "raw",
    folder: "garage-bills",
  });

  fs.unlinkSync(pdfPath); // optional cleanup
  return result.secure_url;
}

// ✅ Step 3: Send WhatsApp Message
async function sendWhatsAppMessage(mediaUrl, customer_num) {
  await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: customer_num,
    body: "Hello! Here is your garage service invoice in PDF format.",
    mediaUrl: [mediaUrl],
  });

  console.log("✅ WhatsApp message sent!");
}

// ✅ Step 4: Full Flow
(async () => {
  try {
    const pdfPath = await generatePDF(billData);
    const publicUrl = await uploadToCloudinary(pdfPath);
    console.log("✅ PDF URL:", publicUrl);
    await sendWhatsAppMessage(publicUrl);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
