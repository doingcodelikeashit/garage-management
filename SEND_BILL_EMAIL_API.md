# Send Bill Email API Documentation

## Overview
This API endpoint allows you to send a bill PDF via email. The PDF is generated on the frontend and sent as a base64 string to the backend for email delivery.

## Endpoint
```
POST /api/billing/send-email/:billId
```

## Parameters

### Path Parameters
- `billId` (string, required): The ID of the bill to send

### Request Body
```json
{
  "email": "customer@example.com",
  "pdfBase64": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...",
  "invoiceNo": "INV-001"
}
```

### Request Body Fields
- `email` (string, required): Customer's email address
- `pdfBase64` (string, required): PDF file encoded as base64 string
- `invoiceNo` (string, optional): Invoice number for the email subject and filename

## Response

### Success Response (200)
```json
{
  "message": "Bill PDF sent successfully via email",
  "email": "customer@example.com",
  "invoiceNo": "INV-001",
  "sentAt": "2024-01-15T10:30:00.000Z"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "Email address is required"
}
```

```json
{
  "message": "PDF data is required"
}
```

#### 404 Not Found
```json
{
  "message": "Bill not found"
}
```

```json
{
  "message": "Job card not found"
}
```

```json
{
  "message": "Garage not found"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Failed to send email",
  "error": "SMTP connection failed"
}
```

## Usage Examples

### cURL Example
```bash
curl -X POST http://localhost:8000/api/billing/send-email/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "pdfBase64": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...",
    "invoiceNo": "INV-001"
  }'
```

### JavaScript Example
```javascript
const sendBillEmail = async (billId, email, pdfBase64, invoiceNo) => {
  try {
    const response = await fetch(`/api/billing/send-email/${billId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        pdfBase64,
        invoiceNo
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result);
      return result;
    } else {
      console.error('Failed to send email:', result);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Usage
const pdfBase64 = "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...";
sendBillEmail('64f1a2b3c4d5e6f7g8h9i0j1', 'customer@example.com', pdfBase64, 'INV-001');
```

### React Example
```jsx
import React, { useState } from 'react';

const SendBillEmail = ({ billId, invoiceNo }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Generate PDF on frontend (example using jsPDF)
      const pdf = new jsPDF();
      pdf.text('Invoice ' + invoiceNo, 20, 20);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      const response = await fetch(`/api/billing/send-email/${billId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pdfBase64,
          invoiceNo
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Email sent successfully!');
      } else {
        setMessage('Failed to send email: ' + result.message);
      }
    } catch (error) {
      setMessage('Error sending email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter customer email"
      />
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Bill Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
```

## Frontend Integration

### PDF Generation Libraries
You can use any of these libraries to generate PDFs on the frontend:

1. **jsPDF** - Simple PDF generation
   ```bash
   npm install jspdf
   ```

2. **React-PDF** - React-based PDF generation
   ```bash
   npm install @react-pdf/renderer
   ```

3. **Puppeteer** - Full-featured PDF generation (if running in Node.js environment)
   ```bash
   npm install puppeteer
   ```

### Converting PDF to Base64
```javascript
// Method 1: Using FileReader (for file uploads)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Method 2: Using jsPDF
const generatePDFBase64 = () => {
  const pdf = new jsPDF();
  pdf.text('Invoice content', 20, 20);
  return pdf.output('datauristring').split(',')[1];
};

// Method 3: Using React-PDF
import { pdf } from '@react-pdf/renderer';

const generatePDFBase64 = async (document) => {
  const blob = await pdf(document).toBlob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
};
```

## Email Template

The email sent will include:
- Professional subject line: "Invoice INV-001 - Garage Name"
- Personalized greeting with customer name
- Invoice details summary
- PDF attachment with filename: "Invoice_INV-001.pdf"
- Professional closing with garage name

## Environment Variables Required

Make sure these environment variables are set:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Notes

- The PDF is converted from base64 to buffer on the server side
- Email sending uses Gmail SMTP (configurable in `Utils/emailWithAttachment.js`)
- The API validates all required fields before processing
- Error handling includes detailed error messages for debugging
- The endpoint is designed to work with any PDF generation library on the frontend
