# Billing API - Complete cURL Commands

## Overview

The billing system provides APIs for generating bills, processing payments, and retrieving invoices for job cards.

## Base URLs

- **Main Billing API**: `http://localhost:8000/api/billing`
- **Garage Billing API**: `http://localhost:8000/api/garage/billing`

---

## 1. Generate Bill API

### Endpoint

```
POST /api/billing/generate/:jobCardId
POST /api/garage/billing/generate/:jobCardId
```

### Prerequisites

- Job card must exist
- Quality check must be approved (`billApproved: true`)

### cURL Commands

#### Basic Bill Generation

```bash
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b049b \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "sellingPrice": 300,
        "hsnNumber": "84212300"
      }
    ],
    "services": [
      {
        "serviceName": "Oil Change",
        "laborCost": 500
      }
    ],
    "discount": 50,
    "gstPercentage": 18,
    "billType": "gst",
    "billToParty": "Customer Name",
    "shiftToParty": "Garage Name"
  }'
```

#### Complex Bill with Multiple Parts and Services

```bash
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b049b \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Air Filter",
        "quantity": 1,
        "sellingPrice": 300,
        "hsnNumber": "84212300"
      },
      {
        "partName": "Brake Pads",
        "quantity": 2,
        "sellingPrice": 800,
        "hsnNumber": "87083000"
      },
      {
        "partName": "Spark Plugs",
        "quantity": 4,
        "sellingPrice": 150,
        "hsnNumber": "85111000"
      }
    ],
    "services": [
      {
        "serviceName": "Oil Change Service",
        "laborCost": 500
      },
      {
        "serviceName": "Brake Service",
        "laborCost": 800
      },
      {
        "serviceName": "Engine Tune-up",
        "laborCost": 1200
      }
    ],
    "discount": 200,
    "gstPercentage": 18,
    "billType": "gst",
    "billToParty": "John Doe",
    "shiftToParty": "ABC Garage"
  }'
```

#### Non-GST Bill

```bash
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b049b \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Wiper Blades",
        "quantity": 2,
        "sellingPrice": 200,
        "hsnNumber": "85122000"
      }
    ],
    "services": [
      {
        "serviceName": "Wiper Replacement",
        "laborCost": 300
      }
    ],
    "discount": 0,
    "billType": "non-gst",
    "billToParty": "Customer Name",
    "shiftToParty": "Garage Name"
  }'
```

### Response Example

```json
{
  "message": "Bill generated successfully",
  "bill": {
    "_id": "6889a7676ecf966d38a92c6e",
    "jobCardId": "688622168861bbf58a4b049b",
    "jobId": "JC-1753621014047",
    "garageId": "68861b328861bbf58a4b03cd",
    "invoiceNo": "003",
    "parts": [...],
    "services": [...],
    "totalPartsCost": 600,
    "totalLaborCost": 1200,
    "subTotal": 1800,
    "gst": 324,
    "gstPercentage": 18,
    "discount": 200,
    "finalAmount": 1924,
    "isPaid": false,
    "paymentMethod": "online",
    "paymentStatus": "pending",
    "billType": "gst",
    "hsnCode": "85111000",
    "billToParty": "Test Customer 3",
    "shiftToParty": "Test Garage 3",
    "bankDetails": {...},
    "createdAt": "2025-07-30T05:02:31.818Z",
    "updatedAt": "2025-07-30T05:02:31.818Z"
  }
}
```

---

## 2. Process Payment API

### Endpoint

```
POST /api/billing/pay
POST /api/garage/billing/pay
```

### cURL Commands

#### Cash Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1753621014047",
    "paymentMethod": "cash"
  }'
```

#### Card Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1753621014047",
    "paymentMethod": "card"
  }'
```

#### Online Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1753621014047",
    "paymentMethod": "online"
  }'
```

### Response Example

```json
{
  "message": "Payment successful",
  "bill": {
    "_id": "6889a7676ecf966d38a92c6e",
    "jobCardId": "688622168861bbf58a4b049b",
    "jobId": "JC-1753621014047",
    "invoiceNo": "003",
    "isPaid": true,
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "finalAmount": 1924,
    "updatedAt": "2025-07-30T05:02:36.560Z"
  }
}
```

---

## 3. Get Invoice API

### Endpoint

```
GET /api/billing/invoice?job_id=:jobId
GET /api/garage/billing/invoice?job_id=:jobId
```

### cURL Commands

#### Get Invoice by Job ID

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=JC-1753621014047"
```

#### Get Invoice with Authentication (if required)

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=JC-1753621014047" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Response Example

```json
{
  "_id": "6889a7676ecf966d38a92c6e",
  "jobCardId": "688622168861bbf58a4b049b",
  "jobId": "JC-1753621014047",
  "garageId": "68861b328861bbf58a4b03cd",
  "invoiceNo": "003",
  "parts": [
    {
      "partName": "Spark Plug",
      "quantity": 4,
      "sellingPrice": 150,
      "hsnNumber": "85111000"
    }
  ],
  "services": [
    {
      "serviceName": "Engine Tune-up",
      "laborCost": 1200
    }
  ],
  "totalPartsCost": 600,
  "totalLaborCost": 1200,
  "subTotal": 1800,
  "gst": 324,
  "gstPercentage": 18,
  "discount": 200,
  "finalAmount": 1924,
  "isPaid": true,
  "paymentMethod": "cash",
  "paymentStatus": "pending",
  "billType": "gst",
  "hsnCode": "85111000",
  "billToParty": "Test Customer 3",
  "shiftToParty": "Test Garage 3",
  "bankDetails": {
    "accountHolderName": "abc",
    "accountNumber": "8662GGS823",
    "ifscCode": "SBIN0005943",
    "bankName": "BOB",
    "branchName": "AHB",
    "upiId": "abc@gmail.coM"
  },
  "createdAt": "2025-07-30T05:02:31.818Z",
  "updatedAt": "2025-07-30T05:02:36.560Z"
}
```

---

## 4. Error Handling Examples

### Invalid Job Card ID

```bash
curl -X POST http://localhost:8000/api/billing/generate/invalid-id \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"partName": "Test", "quantity": 1, "sellingPrice": 100}],
    "services": [{"serviceName": "Test", "laborCost": 200}]
  }'
```

**Response:**

```json
{
  "message": "Server Error",
  "error": "Cast to ObjectId failed for value \"invalid-id\" (type string) at path \"_id\" for model \"JobCard\""
}
```

### Job Card Not Found

```bash
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b0000 \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"partName": "Test", "quantity": 1, "sellingPrice": 100}],
    "services": [{"serviceName": "Test", "laborCost": 200}]
  }'
```

**Response:**

```json
{
  "message": "Job Card not found"
}
```

### Quality Check Not Approved

```bash
# This will fail if job card doesn't have billApproved: true
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b049b \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"partName": "Test", "quantity": 1, "sellingPrice": 100}],
    "services": [{"serviceName": "Test", "laborCost": 200}]
  }'
```

**Response:**

```json
{
  "message": "Quality check not approved. Bill cannot be generated."
}
```

### Bill Not Found for Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "NON_EXISTENT_JOB_ID",
    "paymentMethod": "cash"
  }'
```

**Response:**

```json
{
  "message": "Bill not found"
}
```

### Invoice Not Found

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=NON_EXISTENT_JOB_ID"
```

**Response:**

```json
{
  "message": "Invoice not found"
}
```

---

## 5. Complete Workflow Example

### Step 1: Quality Check Approval

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/688622168861bbf58a4b049b/qualitycheck \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Quality check completed and approved for billing"
  }'
```

### Step 2: Generate Bill

```bash
curl -X POST http://localhost:8000/api/billing/generate/688622168861bbf58a4b049b \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "sellingPrice": 300,
        "hsnNumber": "84212300"
      }
    ],
    "services": [
      {
        "serviceName": "Oil Change",
        "laborCost": 500
      }
    ],
    "discount": 50,
    "gstPercentage": 18,
    "billType": "gst",
    "billToParty": "Customer Name",
    "shiftToParty": "Garage Name"
  }'
```

### Step 3: Process Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1753621014047",
    "paymentMethod": "cash"
  }'
```

### Step 4: Get Invoice

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=JC-1753621014047"
```

---

## 6. Field Descriptions

### Bill Generation Request Fields

- **parts** (Array): List of parts used
  - `partName` (String): Name of the part
  - `quantity` (Number): Quantity used
  - `sellingPrice` (Number): Price per piece
  - `hsnNumber` (String): HSN code for GST
- **services** (Array): List of services provided
  - `serviceName` (String): Name of the service
  - `laborCost` (Number): Cost of labor
- **discount** (Number): Discount amount (default: 0)
- **gstPercentage** (Number): GST percentage (default: 18)
- **billType** (String): "gst" or "non-gst" (default: "gst")
- **billToParty** (String): Customer name
- **shiftToParty** (String): Garage name

### Payment Request Fields

- **jobId** (String): Job ID from the job card
- **paymentMethod** (String): "cash", "card", or "online"

### Response Fields

- **invoiceNo** (String): Auto-generated invoice number
- **totalPartsCost** (Number): Total cost of parts
- **totalLaborCost** (Number): Total cost of labor
- **subTotal** (Number): Subtotal before GST and discount
- **gst** (Number): GST amount
- **finalAmount** (Number): Final amount after all calculations
- **isPaid** (Boolean): Payment status
- **paymentMethod** (String): Method used for payment
- **paymentStatus** (String): "pending", "paid", or "failed"

---

## 7. Notes

1. **Quality Check Required**: Bills can only be generated for job cards that have passed quality check (`billApproved: true`)
2. **Sequential Invoice Numbers**: Invoice numbers are auto-generated sequentially per garage (001, 002, 003...)
3. **GST Calculation**: GST is calculated only for `billType: "gst"`
4. **Bank Details**: Bank details are automatically included from the garage profile
5. **Payment Methods**: Supported payment methods are "cash", "card", and "online"
6. **Authentication**: Some endpoints may require authentication depending on your setup
