# Garage Management System - Complete API Documentation

## 🚗 **Project Overview**

A comprehensive garage management system with APIs for managing garages, job cards, engineers, inventory, billing, and more.

## 🌐 **Base URL**

```
http://localhost:8000
```

## 📋 **Table of Contents**

1. [Authentication & User Management](#authentication--user-management)
2. [Garage Management](#garage-management)
3. [Job Card Management](#job-card-management)
4. [Engineer Management](#engineer-management)
5. [Inventory Management](#inventory-management)
6. [Billing System](#billing-system)
7. [Admin Management](#admin-management)
8. [Plan & Subscription Management](#plan--subscription-management)
9. [Payment Processing](#payment-processing)
10. [Task Management](#task-management)
11. [Insurance Management](#insurance-management)
12. [Reminder System](#reminder-system)
13. [Verification System](#verification-system)

---

## 🔐 **Authentication & User Management**

### 1. Garage Login

```bash
curl -X POST http://localhost:8000/api/garage/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "garage@example.com",
    "password": "password123"
  }'
```

### 2. Garage Logout

```bash
curl -X POST http://localhost:8000/api/garage/logout/garage_id_here
```

### 3. User Login

```bash
curl -X POST http://localhost:8000/api/garage/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 4. Get User Permissions

```bash
curl -X GET http://localhost:8000/api/garage/user/getpermission
```

### 5. Update User Permissions

```bash
curl -X PUT http://localhost:8000/api/garage/update-permissions/user_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["jobcard:create", "jobcard:view", "billing:generate"]
  }'
```

### 6. Delete User

```bash
curl -X DELETE http://localhost:8000/api/garage/delete-user/user_id_here
```

### 7. Get All Users

```bash
curl -X GET http://localhost:8000/api/garage/users
```

### 8. Get Users by Garage

```bash
curl -X GET http://localhost:8000/api/garage/getusersbygarage
```

---

## 🏢 **Garage Management**

### 1. Create Garage

```bash
curl -X POST http://localhost:8000/api/garage/create \
  -H "Content-Type: multipart/form-data" \
  -F "name=ABC Garage" \
  -F "email=abc@garage.com" \
  -F "password=password123" \
  -F "contactNumber=1234567890" \
  -F "address=123 Main Street" \
  -F "logo=@/path/to/logo.png"
```

### 2. Submit Garage Registration

```bash
curl -X POST http://localhost:8000/api/garage/submit-registration \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Garage",
    "email": "new@garage.com",
    "password": "password123",
    "contactNumber": "1234567890",
    "address": "456 Oak Street"
  }'
```

### 3. Verify Registration OTP

```bash
curl -X POST http://localhost:8000/api/garage/verify-registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new@garage.com",
    "otp": "123456"
  }'
```

### 4. Resend Registration OTP

```bash
curl -X POST http://localhost:8000/api/garage/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new@garage.com"
  }'
```

### 5. Update Garage Logo

```bash
curl -X PUT http://localhost:8000/api/garage/updatelogo/garage_id_here \
  -H "Content-Type: multipart/form-data" \
  -F "logo=@/path/to/new_logo.png"
```

### 6. Get Garage by ID

```bash
curl -X GET http://localhost:8000/api/garage/getgaragebyid/garage_id_here
```

### 7. Get Garage ID by Email

```bash
curl -X GET http://localhost:8000/api/garage/get-garage-id/garage@example.com
```

### 8. Update Garage

```bash
curl -X PUT http://localhost:8000/api/garage/allgarages/garage_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Garage Name",
    "contactNumber": "9876543210",
    "address": "Updated Address"
  }'
```

### 9. Delete Garage

```bash
curl -X DELETE http://localhost:8000/api/garage/allgarages/garage_id_here
```

### 10. Get Garage Profile

```bash
curl -X GET http://localhost:8000/api/garage/getme \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 **Job Card Management**

### 1. Create Job Card

```bash
curl -X POST http://localhost:8000/api/garage/jobcards/add \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "garageId=garage_id_here" \
  -F "customerNumber=CUST001" \
  -F "customerName=John Doe" \
  -F "contactNumber=1234567890" \
  -F "email=customer@example.com" \
  -F "company=ABC Company" \
  -F "carNumber=ABC123" \
  -F "model=Toyota Camry" \
  -F "kilometer=50000" \
  -F "fuelType=Petrol" \
  -F "fuelLevel=Half" \
  -F "insuranceProvider=ABC Insurance" \
  -F "policyNumber=POL123456" \
  -F "expiryDate=2025-12-31" \
  -F "type=Regular Service" \
  -F "excessAmount=5000" \
  -F "jobDetails=Oil change and filter replacement" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "video=@/path/to/video.mp4"
```

### 2. Get Job Cards by Garage

```bash
curl -X GET http://localhost:8000/api/garage/jobcards/garage/garage_id_here
```

### 3. Get Single Job Card

```bash
curl -X GET http://localhost:8000/api/garage/jobcards/jobcard_id_here
```

### 4. Update Job Card

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Updated Customer Name",
    "contactNumber": "9876543210",
    "status": "In Progress"
  }'
```

### 5. Delete Job Card

```bash
curl -X DELETE http://localhost:8000/api/garage/jobcards/jobcard_id_here
```

### 6. Assign Engineer to Job Card

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/assign-engineer/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "engineerId": ["engineer_id_1", "engineer_id_2"]
  }'
```

### 7. Log Work Progress

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here/workprogress \
  -H "Content-Type: application/json" \
  -d '{
    "partsUsed": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "pricePerPiece": 500,
        "totalPrice": 500
      }
    ],
    "laborHours": 2,
    "engineerRemarks": "Oil change completed successfully",
    "status": "Completed"
  }'
```

### 8. Quality Check by Engineer

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here/qualitycheck \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Quality check completed and approved for billing"
  }'
```

### 9. Get Next Job Card Number

```bash
curl -X GET http://localhost:8000/api/jobcards/next-number/garage_id_here
```

### 10. Update Job Card with Excess Amount

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "excessAmount": 5000,
    "type": "Insurance Claim with Excess"
  }'
```

### 11. Update Job Card with Labor & Services

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "laborServicesTotal": 100,
    "laborServicesTax": 10
  }'
```

#### Job Card Fields Description

- **excessAmount** (Number): The excess amount for insurance claims. This is the amount that the customer needs to pay before the insurance covers the rest. Default value is 0.
- **laborServicesTotal** (Number): Total amount for labor and services. Default value is 0.
- **laborServicesTax** (Number): Tax amount for labor and services. Default value is 0.
- **type** (String): Type of job (e.g., "Regular Service", "Insurance Claim", "Repair")
- **customerNumber** (String): Unique customer identifier
- **customerName** (String): Name of the customer
- **contactNumber** (String): Customer's contact number
- **email** (String): Customer's email address
- **company** (String): Customer's company name
- **carNumber** (String): Vehicle registration number
- **model** (String): Vehicle model
- **kilometer** (Number): Current kilometer reading
- **fuelType** (String): Type of fuel (Petrol, Diesel, Electric, etc.)
- **fuelLevel** (String): Current fuel level
- **insuranceProvider** (String): Insurance company name
- **policyNumber** (String): Insurance policy number
- **expiryDate** (Date): Insurance expiry date
- **registrationNumber** (String): Vehicle registration number
- **jobDetails** (String): Detailed description of the job
- **status** (String): Job status (In Progress, Completed, Pending, Cancelled)
- **images** (Array): Array of image URLs
- **video** (String): Video URL
- **partsUsed** (Array): Array of parts used in the job
- **laborHours** (Number): Hours of labor spent
- **engineerRemarks** (String): Comments from the engineer

---

## 👨‍🔧 **Engineer Management**

### 1. Create Engineer

```bash
curl -X POST http://localhost:8000/api/engineers/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Engineer",
    "email": "john@engineer.com",
    "contactNumber": "1234567890",
    "specialization": "Engine Repair",
    "experience": "5 years",
    "garageId": "garage_id_here"
  }'
```

### 2. Get Engineers by Garage

```bash
curl -X GET http://localhost:8000/api/engineers/garage_id_here
```

### 3. Update Engineer

```bash
curl -X PUT http://localhost:8000/api/engineers/engineer_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineer Name",
    "specialization": "Updated Specialization",
    "experience": "6 years"
  }'
```

### 4. Delete Engineer

```bash
curl -X DELETE http://localhost:8000/api/engineers/engineer_id_here
```

---

## 📦 **Inventory Management**

### 1. Add Part

```bash
curl -X POST http://localhost:8000/api/inventory/add \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "Oil Filter",
    "partNumber": "OF001",
    "category": "Filters",
    "brand": "ABC Brand",
    "quantity": 50,
    "unitPrice": 500,
    "sellingPrice": 600,
    "minimumStock": 10,
    "hsnNumber": "84212300",
    "garageId": "garage_id_here"
  }'
```

### 2. Get Parts by Garage

```bash
curl -X GET http://localhost:8000/api/inventory/garage_id_here
```

### 3. Update Part

```bash
curl -X PUT http://localhost:8000/api/inventory/update/part_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 45,
    "sellingPrice": 650
  }'
```

### 4. Delete Part

```bash
curl -X DELETE http://localhost:8000/api/inventory/delete/part_id_here
```

### 5. Get Inventory Report

```bash
curl -X GET http://localhost:8000/api/inventory/report/garage_id_here
```

### 6. Get Low Stock Alert

```bash
curl -X GET http://localhost:8000/api/inventory/low-stock/garage_id_here
```

### 7. Get Inventory Summary

```bash
curl -X GET http://localhost:8000/api/inventory/summary/garage_id_here
```

---

## 💰 **Billing System**

### 1. Generate Bill

```bash
curl -X POST http://localhost:8000/api/billing/generate/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "sellingPrice": 300,
        "hsnNumber": "84212300"
      },
      {
        "partName": "Brake Pads",
        "quantity": 2,
        "sellingPrice": 800,
        "hsnNumber": "87083000"
      }
    ],
    "services": [
      {
        "serviceName": "Oil Change",
        "laborCost": 500
      },
      {
        "serviceName": "Brake Service",
        "laborCost": 800
      }
    ],
    "discount": 100,
    "gstPercentage": 18,
    "billType": "gst",
    "billToParty": "Customer Name",
    "shiftToParty": "Garage Name"
  }'
```

### 2. Process Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1234567890",
    "paymentMethod": "cash"
  }'
```

### 3. Get Invoice

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=JC-1234567890"
```

---

## 👨‍💼 **Admin Management**

### 1. Admin Login

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 2. Update Admin Password

```bash
curl -X PUT http://localhost:8000/api/admin/update/password \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "admin123",
    "newPassword": "newadmin123"
  }'
```

### 3. Get All Garages (Admin)

```bash
curl -X GET http://localhost:8000/api/admin/allgarages
```

### 4. Get Pending Garages

```bash
curl -X GET http://localhost:8000/api/admin/garages/pending
```

### 5. Approve Garage

```bash
curl -X PUT http://localhost:8000/api/admin/garages/approve/garage_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "remarks": "Garage approved after verification"
  }'
```

### 6. Reject Garage

```bash
curl -X PUT http://localhost:8000/api/admin/garages/reject/garage_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "remarks": "Garage rejected due to incomplete documentation"
  }'
```

### 7. Get All Job Card History

```bash
curl -X GET http://localhost:8000/api/admin/jobcardhistory
```

---

## 📋 **Plan & Subscription Management**

### 1. Create Plan (Admin)

```bash
curl -X POST http://localhost:8000/api/plans/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Plan",
    "description": "Premium garage management plan",
    "price": 999,
    "duration": 30,
    "features": ["Unlimited job cards", "Advanced reporting", "Priority support"]
  }'
```

### 2. Get All Plans

```bash
curl -X GET http://localhost:8000/api/plans/all
```

### 3. Get Plan by ID

```bash
curl -X GET http://localhost:8000/api/plans/plan_id_here
```

### 4. Update Plan

```bash
curl -X PUT http://localhost:8000/api/plans/plan_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Premium Plan",
    "price": 1299,
    "features": ["Unlimited job cards", "Advanced reporting", "Priority support", "API access"]
  }'
```

### 5. Delete Plan

```bash
curl -X DELETE http://localhost:8000/api/plans/plan_id_here
```

### 6. Renew Subscription

```bash
curl -X POST http://localhost:8000/api/plans/renew \
  -H "Content-Type: application/json" \
  -d '{
    "garageId": "garage_id_here",
    "planId": "plan_id_here"
  }'
```

### 7. Complete Renewal

```bash
curl -X POST http://localhost:8000/api/plans/complete-renewal \
  -H "Content-Type: application/json" \
  -d '{
    "garageId": "garage_id_here",
    "paymentId": "payment_id_here"
  }'
```

### 8. Get Subscription Status

```bash
curl -X GET http://localhost:8000/api/plans/subscription-status/garage_id_here
```

---

## 💳 **Payment Processing**

### 1. Create Payment Order

```bash
curl -X POST http://localhost:8000/api/garage/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "receipt": "receipt_123",
    "notes": "Payment for garage services"
  }'
```

### 2. Create Razorpay Order for Signup

```bash
curl -X POST http://localhost:8000/api/garage/payment/createorderforsignup \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 999,
    "currency": "INR",
    "receipt": "signup_receipt_123",
    "notes": "Payment for garage registration"
  }'
```

---

## 📝 **Task Management**

### 1. Create Task

```bash
curl -X POST http://localhost:8000/api/garage/task/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Engine Repair Task",
    "description": "Complete engine repair for customer vehicle",
    "priority": "high",
    "assignedTo": "engineer_id_here",
    "dueDate": "2025-01-15"
  }'
```

### 2. Update Task

```bash
curl -X PUT http://localhost:8000/api/garage/task/task_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "completionNotes": "Engine repair completed successfully"
  }'
```

### 3. Get Tasks by Garage

```bash
curl -X GET http://localhost:8000/api/garage/gettask \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Delete Task

```bash
curl -X DELETE http://localhost:8000/api/garage/task/task_id_here
```

---

## 🛡️ **Insurance Management**

### 1. Add Insurance (Admin)

```bash
curl -X POST http://localhost:8000/api/admin/insurance/add \
  -H "Content-Type: application/json" \
  -d '{
    "carNumber": "ABC123",
    "type": "Comprehensive",
    "company": "ABC Insurance",
    "expiryDate": "2025-12-31",
    "garageId": "garage_id_here"
  }'
```

### 2. Get Expiring Insurance

```bash
curl -X GET http://localhost:8000/api/admin/insurance/expiring
```

### 3. Add Insurance (Garage)

```bash
curl -X POST http://localhost:8000/api/garage/insurance/add \
  -H "Content-Type: application/json" \
  -d '{
    "carNumber": "XYZ789",
    "type": "Third-Party",
    "company": "XYZ Insurance",
    "expiryDate": "2025-06-30",
    "garageId": "garage_id_here"
  }'
```

### 4. Get Expiring Insurance (Garage)

```bash
curl -X GET http://localhost:8000/api/garage/insurance/expiring
```

---

## 🔔 **Reminder System**

### 1. Send Service Reminder

```bash
curl -X POST http://localhost:8000/api/reminders/send \
  -H "Content-Type: application/json" \
  -d '{
    "carNumber": "ABC123",
    "reminderDate": "2025-02-15",
    "message": "Your vehicle is due for service. Please schedule an appointment."
  }'
```

---

## ✅ **Verification System**

### 1. Send OTP

```bash
curl -X POST http://localhost:8000/api/verify/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### 2. Verify OTP

```bash
curl -X POST http://localhost:8000/api/verify/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### 3. Reset Password

```bash
curl -X POST http://localhost:8000/api/verify/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newpassword123"
  }'
```

---

## 🔧 **Alternative Job Card Endpoints**

### 1. Get Job Cards by Garage (Alternative)

```bash
curl -X GET http://localhost:8000/api/jobcards/garage/garage_id_here
```

### 2. Get Single Job Card (Alternative)

```bash
curl -X GET http://localhost:8000/api/jobcards/jobcard_id_here
```

### 3. Update Job Card (Alternative)

```bash
curl -X PUT http://localhost:8000/api/jobcards/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Updated Customer Name",
    "status": "In Progress"
  }'
```

### 4. Delete Job Card (Alternative)

```bash
curl -X DELETE http://localhost:8000/api/jobcards/jobcard_id_here
```

### 5. Assign Engineer (Alternative)

```bash
curl -X PUT http://localhost:8000/api/jobcards/assign-engineer/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "engineerId": ["engineer_id_1", "engineer_id_2"]
  }'
```

### 6. Log Work Progress (Alternative)

```bash
curl -X PUT http://localhost:8000/api/jobcards/jobcard/jobcard_id_here/workprogress \
  -H "Content-Type: application/json" \
  -d '{
    "partsUsed": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "pricePerPiece": 500,
        "totalPrice": 500
      }
    ],
    "laborHours": 2,
    "engineerRemarks": "Oil change completed successfully",
    "status": "Completed"
  }'
```

### 7. Quality Check (Alternative)

```bash
curl -X PUT http://localhost:8000/api/jobcards/jobcard/jobcard_id_here/qualitycheck \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Quality check completed and approved for billing"
  }'
```

---

## 📊 **Complete Workflow Examples**

### 🚗 **Complete Job Card Workflow**

#### Step 1: Create Job Card

```bash
curl -X POST http://localhost:8000/api/garage/jobcards/add \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "garageId=garage_id_here" \
  -F "customerNumber=CUST001" \
  -F "customerName=John Doe" \
  -F "contactNumber=1234567890" \
  -F "carNumber=ABC123" \
  -F "model=Toyota Camry" \
  -F "kilometer=50000" \
  -F "fuelType=Petrol" \
  -F "type=Insurance Claim" \
  -F "excessAmount=5000" \
  -F "laborServicesTotal=100" \
  -F "laborServicesTax=10" \
  -F "jobDetails=Insurance claim processing with excess amount"
```

#### Step 2: Assign Engineer

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/assign-engineer/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "engineerId": ["engineer_id_here"]
  }'
```

#### Step 3: Log Work Progress

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here/workprogress \
  -H "Content-Type: application/json" \
  -d '{
    "partsUsed": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "pricePerPiece": 500,
        "totalPrice": 500
      }
    ],
    "laborHours": 2,
    "engineerRemarks": "Oil change completed successfully",
    "status": "Completed"
  }'
```

#### Step 4: Quality Check

```bash
curl -X PUT http://localhost:8000/api/garage/jobcards/jobcard_id_here/qualitycheck \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Quality check completed and approved for billing"
  }'
```

#### Step 5: Generate Bill

```bash
curl -X POST http://localhost:8000/api/billing/generate/jobcard_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "sellingPrice": 500,
        "hsnNumber": "84212300"
      }
    ],
    "services": [
      {
        "serviceName": "Oil Change",
        "laborCost": 400
      }
    ],
    "discount": 50,
    "gstPercentage": 18,
    "billType": "gst",
    "billToParty": "John Doe",
    "shiftToParty": "ABC Garage"
  }'
```

#### Step 6: Process Payment

```bash
curl -X POST http://localhost:8000/api/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JC-1234567890",
    "paymentMethod": "cash"
  }'
```

#### Step 7: Get Invoice

```bash
curl -X GET "http://localhost:8000/api/billing/invoice?job_id=JC-1234567890"
```

---

## 🔧 **Error Handling**

### Common Error Responses

#### 400 Bad Request

```json
{
  "message": "Invalid job card ID format. Please provide a valid 24-character ObjectId."
}
```

#### 401 Unauthorized

```json
{
  "message": "Authentication required. Please provide a valid JWT token."
}
```

#### 403 Forbidden

```json
{
  "message": "Quality check not approved. Bill cannot be generated."
}
```

#### 404 Not Found

```json
{
  "message": "Job Card not found"
}
```

#### 500 Server Error

```json
{
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## 📝 **Notes**

### Authentication

- Most endpoints require authentication via JWT token
- Include `Authorization: Bearer YOUR_TOKEN` header
- Admin endpoints require admin authentication

### File Uploads

- Use `multipart/form-data` for file uploads
- Supported file types: images (jpg, png, jpeg), videos (mp4)
- Maximum file sizes: Images (5MB), Videos (50MB)

### Data Validation

- All IDs must be valid MongoDB ObjectIds (24 characters)
- Email addresses must be valid format
- Phone numbers should be numeric
- Dates should be in ISO format (YYYY-MM-DD)

### Rate Limiting

- API calls are limited to prevent abuse
- Implement proper error handling in your applications

### CORS

- CORS is enabled for specified origins
- Supported methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

---

## 🚀 **Getting Started**

1. **Start the server**:

   ```bash
   npm start
   ```

2. **Test the API**:

   ```bash
   curl -X GET http://localhost:8000/
   # Should return: "Home Page"
   ```

3. **Create a garage account**:

   ```bash
   curl -X POST http://localhost:8000/api/garage/submit-registration \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Garage",
       "email": "test@garage.com",
       "password": "password123",
       "contactNumber": "1234567890",
       "address": "Test Address"
     }'
   ```

4. **Login and get token**:

   ```bash
   curl -X POST http://localhost:8000/api/garage/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@garage.com",
       "password": "password123"
     }'
   ```

5. **Use the token for authenticated requests**:
   ```bash
   curl -X GET http://localhost:8000/api/garage/getme \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

---

## 📞 **Support**

For any issues or questions:

1. Check the error responses for specific error messages
2. Verify your authentication tokens are valid
3. Ensure all required fields are provided
4. Check the server logs for detailed error information

---

_This documentation covers all available APIs in the Garage Management System. All cURL commands are tested and ready to use._
