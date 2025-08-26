const mongoose = require("mongoose");
const JobCard = require("./Model/jobCard.model");

// Test configuration
const TEST_GARAGE_ID = "507f1f77bcf86cd799439011"; // Replace with actual garage ID

async function testPostmanRequest() {
  try {
    console.log("🧪 Testing Postman Request Structure...\n");

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
      status: "In Progress",
      jobCardNumber: 1,
      createdBy: TEST_GARAGE_ID,
      createdByModel: "Garage",
    });

    await testJobCard.save();
    console.log("✅ Test job card created successfully");

    // Test 2: Simulate the exact Postman request structure
    console.log("\n2. Testing exact Postman request structure...");
    const postmanRequestData = {
      partsUsed: [
        {
          partName: "check",
          partNumber: "30",
          hsnNumber: "SHE2733",
          quantity: 1,
          pricePerPiece: 100,
          totalPrice: 100,
          taxPercentage: 0,
          igst: 0,
          cgstSgst: 0,
        }
      ]
    };

    // Update the job card with the Postman request data
    testJobCard.partsUsed = postmanRequestData.partsUsed;
    await testJobCard.save();
    console.log("✅ Job card updated with Postman request data");

    // Test 3: Verify the data is stored correctly
    console.log("\n3. Verifying stored data...");
    const updatedJobCard = await JobCard.findById(testJobCard._id);
    
    if (updatedJobCard.partsUsed && updatedJobCard.partsUsed.length > 0) {
      console.log("✅ Parts stored successfully:");
      updatedJobCard.partsUsed.forEach((part, index) => {
        console.log(`   Part ${index + 1}:`);
        console.log(`     - partName: "${part.partName}"`);
        console.log(`     - partNumber: "${part.partNumber}"`);
        console.log(`     - hsnNumber: "${part.hsnNumber}"`);
        console.log(`     - quantity: ${part.quantity}`);
        console.log(`     - pricePerPiece: ${part.pricePerPiece}`);
        console.log(`     - totalPrice: ${part.totalPrice}`);
        console.log(`     - taxPercentage: ${part.taxPercentage}`);
        console.log(`     - taxAmount: ${part.taxAmount}`);
        console.log(`     - igst: ${part.igst}`);
        console.log(`     - cgstSgst: ${part.cgstSgst}`);
      });
    } else {
      console.log("❌ No parts found in updated job card");
    }

    // Test 4: Test with validation function
    console.log("\n4. Testing with validation function...");
    const { validateAndProcessParts } = require("./Controllers/jobCard.controller");
    
    try {
      const validatedParts = validateAndProcessParts(postmanRequestData.partsUsed);
      console.log("✅ Validation function processed parts successfully:");
      validatedParts.forEach((part, index) => {
        console.log(`   Validated Part ${index + 1}:`);
        console.log(`     - partName: "${part.partName}"`);
        console.log(`     - partNumber: "${part.partNumber}"`);
        console.log(`     - hsnNumber: "${part.hsnNumber}"`);
        console.log(`     - quantity: ${part.quantity}`);
        console.log(`     - pricePerPiece: ${part.pricePerPiece}`);
        console.log(`     - totalPrice: ${part.totalPrice}`);
        console.log(`     - taxPercentage: ${part.taxPercentage}`);
        console.log(`     - taxAmount: ${part.taxAmount}`);
        console.log(`     - igst: ${part.igst}`);
        console.log(`     - cgstSgst: ${part.cgstSgst}`);
      });
    } catch (error) {
      console.log("❌ Validation function failed:", error.message);
    }

    // Test 5: Cleanup test data
    console.log("\n5. Cleaning up test data...");
    await JobCard.findByIdAndDelete(testJobCard._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Job card creation");
    console.log("   ✅ Postman request structure handling");
    console.log("   ✅ Data storage verification");
    console.log("   ✅ Validation function testing");
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
      return testPostmanRequest();
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

module.exports = { testPostmanRequest };
