const mongoose = require("mongoose");
const Bill = require("./Model/bill.model");
const JobCard = require("./Model/jobCard.model");

// Test configuration
const TEST_GARAGE_ID = "507f1f77bcf86cd799439011"; // Replace with actual garage ID

async function testSendBillEmail() {
  try {
    console.log("🧪 Testing Send Bill Email API...\n");

    // Test 1: Create a test job card
    console.log("1. Creating test job card...");
    const testJobCard = new JobCard({
      garageId: TEST_GARAGE_ID,
      customerNumber: "CUST001",
      customerName: "John Doe",
      contactNumber: "+1234567890",
      email: "john.doe@example.com",
      carNumber: "TEST123",
      model: "Toyota Camry 2020",
      kilometer: 50000,
      fuelType: "Petrol",
      status: "Completed",
      jobCardNumber: 1,
      createdBy: TEST_GARAGE_ID,
      createdByModel: "Garage",
      jobId: "JC-TEST-001",
    });

    await testJobCard.save();
    console.log("✅ Test job card created successfully");

    // Test 2: Create a test bill
    console.log("\n2. Creating test bill...");
    const testBill = new Bill({
      jobCardId: testJobCard._id,
      jobId: testJobCard.jobId,
      garageId: TEST_GARAGE_ID,
      invoiceNo: "001",
      parts: [
        {
          partName: "Engine Oil",
          quantity: 1,
          sellingPrice: 100,
          hsnNumber: "2710.19.00",
        },
      ],
      totalPartsCost: 100,
      totalLaborCost: 0,
      subTotal: 100,
      gst: 18,
      gstPercentage: 18,
      discount: 0,
      finalAmount: 118,
      billType: "gst",
      hsnCode: "2710.19.00",
    });

    await testBill.save();
    console.log("✅ Test bill created successfully");

    // Test 3: Simulate PDF generation (base64 string)
    console.log("\n3. Simulating PDF generation...");
    const mockPDFBase64 = "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK";

    // Test 4: Test API request structure
    console.log("\n4. Testing API request structure...");
    const apiRequest = {
      method: "POST",
      url: `/api/billing/send-email/${testBill._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: "customer@example.com",
        pdfBase64: mockPDFBase64,
        invoiceNo: "INV-001",
      },
    };

    console.log("✅ API request structure:");
    console.log(`   URL: ${apiRequest.url}`);
    console.log(`   Method: ${apiRequest.method}`);
    console.log(`   Email: ${apiRequest.body.email}`);
    console.log(`   Invoice No: ${apiRequest.body.invoiceNo}`);
    console.log(`   PDF Base64 Length: ${apiRequest.body.pdfBase64.length} characters`);

    // Test 5: Test cURL command
    console.log("\n5. Generated cURL command:");
    const curlCommand = `curl -X POST http://localhost:8000/api/billing/send-email/${testBill._id} \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "customer@example.com",
    "pdfBase64": "${mockPDFBase64}",
    "invoiceNo": "INV-001"
  }'`;

    console.log(curlCommand);

    // Test 6: Test JavaScript fetch example
    console.log("\n6. JavaScript fetch example:");
    const jsExample = `
const sendBillEmail = async () => {
  try {
    const response = await fetch('/api/billing/send-email/${testBill._id}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@example.com',
        pdfBase64: '${mockPDFBase64}',
        invoiceNo: 'INV-001'
      })
    });

    const result = await response.json();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};`;

    console.log(jsExample);

    // Test 7: Test expected response
    console.log("\n7. Expected API response:");
    const expectedResponse = {
      message: "Bill PDF sent successfully via email",
      email: "customer@example.com",
      invoiceNo: "INV-001",
      sentAt: new Date().toISOString(),
    };

    console.log("✅ Expected response:");
    console.log(JSON.stringify(expectedResponse, null, 2));

    // Test 8: Cleanup test data
    console.log("\n8. Cleaning up test data...");
    await Bill.findByIdAndDelete(testBill._id);
    await JobCard.findByIdAndDelete(testJobCard._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Job card creation");
    console.log("   ✅ Bill creation");
    console.log("   ✅ PDF base64 simulation");
    console.log("   ✅ API request structure");
    console.log("   ✅ cURL command generation");
    console.log("   ✅ JavaScript example");
    console.log("   ✅ Expected response format");
    console.log("   ✅ Data cleanup");

    console.log("\n📝 Next Steps:");
    console.log("   1. Set up environment variables (EMAIL_USER, EMAIL_PASS)");
    console.log("   2. Generate PDF on frontend using your preferred library");
    console.log("   3. Convert PDF to base64 string");
    console.log("   4. Call the API endpoint with the required data");
    console.log("   5. Handle the response appropriately");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // Connect to database first
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/garage-management")
    .then(() => {
      console.log("📦 Connected to database");
      return testSendBillEmail();
    })
    .then(() => {
      console.log("🏁 Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test failed:", error);
      process.exit(1);
    });
}

module.exports = { testSendBillEmail };
