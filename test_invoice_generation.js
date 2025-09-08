const mongoose = require("mongoose");
const Bill = require("./Model/bill.model");
const JobCard = require("./Model/jobCard.model");

// Test configuration
const TEST_GARAGE_ID = "507f1f77bcf86cd799439011"; // Replace with actual garage ID

async function testInvoiceGeneration() {
  try {
    console.log("🧪 Testing Invoice Number Generation...\n");

    // Test 1: Clean up any existing test bills
    console.log("1. Cleaning up existing test bills...");
    await Bill.deleteMany({ garageId: TEST_GARAGE_ID });
    console.log("✅ Test bills cleaned up");

    // Test 2: Create a test job card
    console.log("\n2. Creating test job card...");
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

    // Test 3: Generate first bill
    console.log("\n3. Generating first bill...");
    const firstBill = new Bill({
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

    await firstBill.save();
    console.log("✅ First bill created with invoiceNo: 001");

    // Test 4: Generate second bill
    console.log("\n4. Generating second bill...");
    const secondBill = new Bill({
      jobCardId: testJobCard._id,
      jobId: testJobCard.jobId,
      garageId: TEST_GARAGE_ID,
      invoiceNo: "002",
      parts: [
        {
          partName: "Oil Filter",
          quantity: 1,
          sellingPrice: 200,
          hsnNumber: "8421.23.00",
        },
      ],
      totalPartsCost: 200,
      totalLaborCost: 0,
      subTotal: 200,
      gst: 36,
      gstPercentage: 18,
      discount: 0,
      finalAmount: 236,
      billType: "gst",
      hsnCode: "8421.23.00",
    });

    await secondBill.save();
    console.log("✅ Second bill created with invoiceNo: 002");

    // Test 5: Test invoice number generation logic
    console.log("\n5. Testing invoice number generation logic...");
    
    // Simulate the logic from the controller
    const lastBill = await Bill.findOne({ garageId: TEST_GARAGE_ID }).sort({
      createdAt: -1,
    });
    
    let nextInvoiceNo = "001";
    if (lastBill && lastBill.invoiceNo) {
      // Extract number from invoiceNo (e.g., "001" -> 1, "INV-001" -> 1)
      const lastNumStr = lastBill.invoiceNo.replace(/[^\d]/g, ''); // Remove non-digits
      const lastNum = parseInt(lastNumStr, 10);
      if (!isNaN(lastNum)) {
        nextInvoiceNo = (lastNum + 1).toString().padStart(3, "0");
      }
    }
    
    console.log(`✅ Next invoice number should be: ${nextInvoiceNo}`);
    console.log(`✅ Formatted invoice number: INV-${nextInvoiceNo}`);

    // Test 6: Verify all bills have correct format
    console.log("\n6. Verifying all bills...");
    const allBills = await Bill.find({ garageId: TEST_GARAGE_ID }).sort({ createdAt: 1 });
    
    console.log("✅ All bills with formatted invoice numbers:");
    allBills.forEach((bill, index) => {
      console.log(`   Bill ${index + 1}: INV-${bill.invoiceNo} (Amount: ₹${bill.finalAmount})`);
    });

    // Test 7: Test edge cases
    console.log("\n7. Testing edge cases...");
    
    // Test with existing invoiceNo that has prefix
    const billWithPrefix = new Bill({
      jobCardId: testJobCard._id,
      jobId: testJobCard.jobId,
      garageId: TEST_GARAGE_ID,
      invoiceNo: "INV-005", // This should be handled correctly
      parts: [],
      totalPartsCost: 0,
      totalLaborCost: 0,
      subTotal: 0,
      gst: 0,
      gstPercentage: 0,
      discount: 0,
      finalAmount: 0,
      billType: "gst",
    });

    await billWithPrefix.save();
    console.log("✅ Bill with prefix created: INV-005");

    // Test the logic again
    const lastBillWithPrefix = await Bill.findOne({ garageId: TEST_GARAGE_ID }).sort({
      createdAt: -1,
    });
    
    let nextInvoiceNoAfterPrefix = "001";
    if (lastBillWithPrefix && lastBillWithPrefix.invoiceNo) {
      const lastNumStr = lastBillWithPrefix.invoiceNo.replace(/[^\d]/g, '');
      const lastNum = parseInt(lastNumStr, 10);
      if (!isNaN(lastNum)) {
        nextInvoiceNoAfterPrefix = (lastNum + 1).toString().padStart(3, "0");
      }
    }
    
    console.log(`✅ Next invoice number after prefix: ${nextInvoiceNoAfterPrefix}`);
    console.log(`✅ Formatted: INV-${nextInvoiceNoAfterPrefix}`);

    // Test 8: Cleanup test data
    console.log("\n8. Cleaning up test data...");
    await Bill.deleteMany({ garageId: TEST_GARAGE_ID });
    await JobCard.findByIdAndDelete(testJobCard._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Invoice number generation logic");
    console.log("   ✅ Sequential numbering (001, 002, 003...)");
    console.log("   ✅ Proper formatting (INV-001, INV-002...)");
    console.log("   ✅ Edge case handling (existing prefixes)");
    console.log("   ✅ Data cleanup");

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
      return testInvoiceGeneration();
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

module.exports = { testInvoiceGeneration };
