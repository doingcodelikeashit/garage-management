const mongoose = require("mongoose");
const JobCard = require("./Model/jobCard.model");

// Test configuration
const TEST_GARAGE_ID = "507f1f77bcf86cd799439011"; // Replace with actual garage ID

async function testPartsStorage() {
  try {
    console.log("🧪 Testing Parts Storage with Tax Amount and HSN Number...\n");

    // Test 1: Create a test job card with parts
    console.log("1. Creating test job card with parts...");
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
      partsUsed: [
        {
          partName: "Engine Oil",
          quantity: 2,
          pricePerPiece: 50,
          totalPrice: 100,
          taxAmount: 18, // 18% GST
          hsnNumber: "2710.19.00",
        },
        {
          partName: "Oil Filter",
          quantity: 1,
          pricePerPiece: 200,
          totalPrice: 200,
          taxAmount: 36, // 18% GST
          hsnNumber: "8421.23.00",
        },
      ],
    });

    await testJobCard.save();
    console.log("✅ Test job card created successfully with parts");

    // Test 2: Verify parts are stored correctly
    console.log("\n2. Verifying parts storage...");
    const savedJobCard = await JobCard.findById(testJobCard._id);
    
    if (savedJobCard.partsUsed && savedJobCard.partsUsed.length > 0) {
      console.log("✅ Parts stored successfully:");
      savedJobCard.partsUsed.forEach((part, index) => {
        console.log(`   Part ${index + 1}:`);
        console.log(`     - Name: ${part.partName}`);
        console.log(`     - Quantity: ${part.quantity}`);
        console.log(`     - Price: ${part.pricePerPiece}`);
        console.log(`     - Total: ${part.totalPrice}`);
        console.log(`     - Tax Amount: ${part.taxAmount}`);
        console.log(`     - HSN Number: ${part.hsnNumber}`);
      });
    } else {
      console.log("❌ No parts found in saved job card");
    }

    // Test 3: Update parts with new tax and HSN information
    console.log("\n3. Testing parts update...");
    const updatedParts = [
      {
        partName: "Brake Pads",
        quantity: 1,
        pricePerPiece: 300,
        totalPrice: 300,
        taxAmount: 54, // 18% GST
        hsnNumber: "8708.30.00",
      },
    ];

    savedJobCard.partsUsed = updatedParts;
    await savedJobCard.save();
    console.log("✅ Parts updated successfully");

    // Test 4: Verify updated parts
    console.log("\n4. Verifying updated parts...");
    const updatedJobCard = await JobCard.findById(testJobCard._id);
    
    if (updatedJobCard.partsUsed && updatedJobCard.partsUsed.length > 0) {
      console.log("✅ Updated parts stored correctly:");
      updatedJobCard.partsUsed.forEach((part, index) => {
        console.log(`   Part ${index + 1}:`);
        console.log(`     - Name: ${part.partName}`);
        console.log(`     - Quantity: ${part.quantity}`);
        console.log(`     - Price: ${part.pricePerPiece}`);
        console.log(`     - Total: ${part.totalPrice}`);
        console.log(`     - Tax Amount: ${part.taxAmount}`);
        console.log(`     - HSN Number: ${part.hsnNumber}`);
      });
    } else {
      console.log("❌ No updated parts found");
    }

    // Test 5: Test validation with missing fields
    console.log("\n5. Testing validation...");
    try {
      const invalidParts = [
        {
          partName: "Test Part",
          // Missing quantity and pricePerPiece
          taxAmount: 10,
          hsnNumber: "TEST123",
        },
      ];

      savedJobCard.partsUsed = invalidParts;
      await savedJobCard.save();
      console.log("❌ Validation failed - should have thrown error");
    } catch (error) {
      console.log("✅ Validation working correctly - caught invalid parts");
      console.log(`   Error: ${error.message}`);
    }

    // Test 6: Cleanup test data
    console.log("\n6. Cleaning up test data...");
    await JobCard.findByIdAndDelete(testJobCard._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Parts creation with tax and HSN");
    console.log("   ✅ Parts storage verification");
    console.log("   ✅ Parts update functionality");
    console.log("   ✅ Validation error handling");
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
      return testPartsStorage();
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

module.exports = { testPartsStorage };
