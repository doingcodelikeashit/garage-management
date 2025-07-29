const Bill = require("../Model/bill.model");
const JobCard = require("../Model/jobCard.model");

exports.generateBill = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const {
      parts,
      services,
      discount = 0,
      gstPercentage = 18,
      billType = "gst",
      billToParty,
      shiftToParty,
    } = req.body;

    const jobCard = await JobCard.findById(jobCardId);
    if (!jobCard)
      return res.status(404).json({ message: "Job Card not found" });

    // ✅ Ensure quality check approval before billing
    if (!jobCard.qualityCheck || !jobCard.qualityCheck.billApproved) {
      return res.status(403).json({
        message: "Quality check not approved. Bill cannot be generated.",
      });
    }

    // Get garage for logo and bank details
    const garage = await require("../Model/garage.model").findById(
      jobCard.garageId
    );
    if (!garage) return res.status(404).json({ message: "Garage not found" });

    // Get last invoice number for this garage
    const lastBill = await Bill.findOne({ garageId: jobCard.garageId }).sort({
      createdAt: -1,
    });
    let invoiceNo = "001";
    if (lastBill && lastBill.invoiceNo) {
      const lastNum = parseInt(lastBill.invoiceNo, 10);
      invoiceNo = (lastNum + 1).toString().padStart(3, "0");
    }

    // Calculate totals
    let totalPartsCost = 0;
    let hsnCode = "";
    if (parts && parts.length > 0) {
      totalPartsCost = parts.reduce(
        (sum, p) => sum + p.quantity * p.sellingPrice,
        0
      );
      // Use HSN from first part (assume all same for now)
      hsnCode = parts[0].hsnNumber || "";
    }
    const totalLaborCost = services
      ? services.reduce((sum, s) => sum + s.laborCost, 0)
      : 0;
    const subTotal = totalPartsCost + totalLaborCost;

    // GST logic
    let gst = 0;
    if (billType === "gst") {
      gst = parseFloat(((subTotal * gstPercentage) / 100).toFixed(2));
    }
    const finalAmount = subTotal + gst - discount;

    const newBill = new Bill({
      jobCardId,
      garageId: jobCard.garageId,
      invoiceNo,
      parts,
      services,
      totalPartsCost,
      totalLaborCost,
      subTotal,
      gst,
      gstPercentage: billType === "gst" ? gstPercentage : 0,
      discount,
      finalAmount,
      billType,
      hsnCode,
      logo: garage.logo,
      billToParty,
      shiftToParty,
      bankDetails: garage.bankDetails,
    });

    await newBill.save();

    res
      .status(201)
      .json({ message: "Bill generated successfully", bill: newBill });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// Process Payment
exports.processPayment = async (req, res) => {
  try {
    const { jobId, paymentMethod } = req.body;
    const bill = await Bill.findOneAndUpdate(
      { jobId },
      { isPaid: true, paymentMethod },
      { new: true }
    );

    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Payment successful", bill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Invoice by Job ID
exports.getInvoice = async (req, res) => {
  try {
    const { job_id } = req.query;
    let filter = { jobId: job_id };
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.role !== "super-admin"
    ) {
      // Find jobcard and check createdBy
      const jobCard = await require("../Model/jobCard.model").findOne({
        jobId: job_id,
      });
      if (!jobCard || String(jobCard.createdBy) !== String(req.user._id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    const bill = await Bill.findOne(filter);
    if (!bill) return res.status(404).json({ message: "Invoice not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
