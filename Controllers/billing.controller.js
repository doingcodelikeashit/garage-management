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
    // if (!jobCard.qualityCheck || !jobCard.qualityCheck.billApproved) {
    //   return res.status(403).json({
    //     message: "Quality check not approved. Bill cannot be generated.",
    //   });
    // }

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
      jobId: jobCard.jobId, // Add jobId from job card
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

// Get last invoice number for garage
exports.getLastInvoiceNumber = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Find the last bill for this garage
    const lastBill = await Bill.findOne({ garageId }).sort({ createdAt: -1 });

    let lastInvoiceNo = "INV000";
    if (lastBill && lastBill.invoiceNo) {
      lastInvoiceNo = `INV${lastBill.invoiceNo}`;
    }

    res.json({ lastInvoiceNo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get financial report for garage
exports.getFinancialReport = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        },
      };
    }

    // Get all bills for the garage
    const bills = await Bill.find({
      garageId,
      ...dateFilter,
    }).populate("jobCardId", "customerName carNumber model status");

    // Calculate financial summary
    let totalRevenue = 0;
    let totalPartsCost = 0;
    let totalLaborCost = 0;
    let totalGST = 0;
    let totalDiscount = 0;
    let completedJobs = 0;
    let pendingJobs = 0;

    const monthlyData = {};
    const billTypeBreakdown = { gst: 0, "non-gst": 0 };

    bills.forEach((bill) => {
      totalRevenue += bill.finalAmount || 0;
      totalPartsCost += bill.totalPartsCost || 0;
      totalLaborCost += bill.totalLaborCost || 0;
      totalGST += bill.gst || 0;
      totalDiscount += bill.discount || 0;

      // Count by bill type
      if (bill.billType === "gst") {
        billTypeBreakdown.gst += bill.finalAmount || 0;
      } else {
        billTypeBreakdown["non-gst"] += bill.finalAmount || 0;
      }

      // Monthly breakdown
      const month = new Date(bill.createdAt).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          revenue: 0,
          jobs: 0,
          partsCost: 0,
          laborCost: 0,
        };
      }
      monthlyData[month].revenue += bill.finalAmount || 0;
      monthlyData[month].jobs += 1;
      monthlyData[month].partsCost += bill.totalPartsCost || 0;
      monthlyData[month].laborCost += bill.totalLaborCost || 0;

      // Job status count
      if (bill.jobCardId && bill.jobCardId.status === "Completed") {
        completedJobs += 1;
      } else {
        pendingJobs += 1;
      }
    });

    // Calculate profit
    const totalCost = totalPartsCost + totalLaborCost;
    const grossProfit = totalRevenue - totalCost;
    const netProfit = grossProfit - totalDiscount;

    // Get current month data
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthData = monthlyData[currentMonth] || {
      revenue: 0,
      jobs: 0,
      partsCost: 0,
      laborCost: 0,
    };

    const report = {
      garageId,
      generatedAt: new Date(),
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary: {
        totalBills: bills.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalPartsCost: parseFloat(totalPartsCost.toFixed(2)),
        totalLaborCost: parseFloat(totalLaborCost.toFixed(2)),
        totalGST: parseFloat(totalGST.toFixed(2)),
        totalDiscount: parseFloat(totalDiscount.toFixed(2)),
        grossProfit: parseFloat(grossProfit.toFixed(2)),
        netProfit: parseFloat(netProfit.toFixed(2)),
        completedJobs,
        pendingJobs,
      },
      currentMonth: {
        revenue: parseFloat(currentMonthData.revenue.toFixed(2)),
        jobs: currentMonthData.jobs,
        partsCost: parseFloat(currentMonthData.partsCost.toFixed(2)),
        laborCost: parseFloat(currentMonthData.laborCost.toFixed(2)),
      },
      billTypeBreakdown,
      monthlyBreakdown: Object.keys(monthlyData).map((month) => ({
        month,
        ...monthlyData[month],
        revenue: parseFloat(monthlyData[month].revenue.toFixed(2)),
        partsCost: parseFloat(monthlyData[month].partsCost.toFixed(2)),
        laborCost: parseFloat(monthlyData[month].laborCost.toFixed(2)),
      })),
      recentBills: bills.slice(0, 10).map((bill) => ({
        invoiceNo: bill.invoiceNo,
        jobId: bill.jobId,
        customerName: bill.jobCardId?.customerName || "N/A",
        carNumber: bill.jobCardId?.carNumber || "N/A",
        amount: bill.finalAmount,
        createdAt: bill.createdAt,
        billType: bill.billType,
      })),
    };

    res.status(200).json({
      message: "Financial report generated successfully",
      report,
    });
  } catch (error) {
    console.error("getFinancialReport error:", error);
    res.status(500).json({
      message: "Failed to generate financial report",
      error: error.message,
    });
  }
};
