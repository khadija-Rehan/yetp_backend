const User = require("../models/User");
const Challan = require("../models/Challan");

// ── Dashboard Stats ────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, verified, testPassed, challans] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ testPassed: true }),
      Challan.find(),
    ]);

    const paidChallans   = challans.filter(c => c.paid).length;
    const unpaidChallans = challans.filter(c => !c.paid).length;
    const totalRevenue   = challans.filter(c => c.paid).reduce((s, c) => s + (c.amount || 0), 0);

    res.json({
      status: "success",
      data: {
        totalStudents,
        verified,
        unverified: totalStudents - verified,
        testPassed,
        totalChallans: challans.length,
        paidChallans,
        unpaidChallans,
        totalRevenue,
        collectionRate: challans.length ? Math.round((paidChallans / challans.length) * 100) : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Monthly Stats ──────────────────────────────────────────────
exports.getMonthlyStats = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01`);
    const end   = new Date(`${year + 1}-01-01`);

    const [users, challans] = await Promise.all([
      User.find({ createdAt: { $gte: start, $lt: end } }, "createdAt"),
      Challan.find({ createdAt: { $gte: start, $lt: end } }, "createdAt amount paid"),
    ]);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month_num: String(i + 1),
      enrollments: 0,
      challans: 0,
      revenue: 0,
    }));

    users.forEach(u => {
      const m = new Date(u.createdAt).getMonth();
      months[m].enrollments += 1;
    });
    challans.forEach(c => {
      const m = new Date(c.createdAt).getMonth();
      months[m].challans += 1;
      if (c.paid) months[m].revenue += c.amount || 0;
    });

    res.json({ status: "success", data: months });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Get All Students ───────────────────────────────────────────
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, verified, gender, city, qualification, paymentStatus, admissionType } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (search) {
      query.$or = [
        { fullName:   { $regex: search, $options: "i" } },
        { email:      { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { cnic:       { $regex: search, $options: "i" } },
        { mobile:     { $regex: search, $options: "i" } },
      ];
    }
    if (verified === "true")  query.isVerified = true;
    if (verified === "false") query.isVerified = false;
    if (gender)        query.gender        = { $regex: gender,        $options: "i" };
    if (city)          query.city          = { $regex: city,          $options: "i" };
    if (qualification) query.qualification = { $regex: qualification, $options: "i" };
    if (admissionType) query.admissionType = admissionType;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -verifyToken -resetPasswordToken -resetPasswordExpire")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    // Attach challan info
    const ids = users.map(u => u._id);
    const challans = await Challan.find({ userId: { $in: ids } });
    const challanMap = {};
    challans.forEach(c => {
      const key = String(c.userId);
      if (!challanMap[key] || (c.secondEnrollChallan === false)) challanMap[key] = c;
    });

    let data = users.map(u => ({
      ...u.toObject(),
      challan: challanMap[String(u._id)] || null,
    }));

    // Filter by paymentStatus after join
    if (paymentStatus === "paid")   data = data.filter(u => u.challan?.paid);
    if (paymentStatus === "unpaid") data = data.filter(u => u.challan && !u.challan.paid);
    if (paymentStatus === "no-challan") data = data.filter(u => !u.challan);

    res.json({ status: "success", data, total });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Get Student By ID ──────────────────────────────────────────
exports.getStudentById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -verifyToken -resetPasswordToken -resetPasswordExpire");
    if (!user) return res.status(404).json({ status: "error", message: "Student not found" });

    const challans = await Challan.find({ userId: req.params.id });
    res.json({ status: "success", data: { ...user.toObject(), challans } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Update Student ─────────────────────────────────────────────
exports.updateStudent = async (req, res) => {
  try {
    const { fullName, fatherName, email, mobile, cnic, gender, city, qualification, permanentAddress } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, fatherName, email, mobile, cnic, gender, city, qualification, permanentAddress },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ status: "error", message: "Student not found" });
    res.json({ status: "success", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Delete Student ─────────────────────────────────────────────
exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ status: "error", message: "Student not found" });
    await Challan.deleteMany({ userId: req.params.id });
    res.json({ status: "success", message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Update Test Score (Admin) ──────────────────────────────────
exports.updateTestScore = async (req, res) => {
  try {
    const { testScore, testPassed } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { testScore, testPassed },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ status: "error", message: "Student not found" });
    res.json({ status: "success", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Get All Challans ───────────────────────────────────────────
exports.getAllChallans = async (req, res) => {
  try {
    const { page = 1, limit = 10, paid, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (paid === "true")  query.paid = true;
    if (paid === "false") query.paid = false;

    const [challans, total] = await Promise.all([
      Challan.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Challan.countDocuments(query),
    ]);

    const userIds = challans.map(c => c.userId);
    const users = await User.find({ _id: { $in: userIds } }).select("fullName email rollNumber mobile");
    const userMap = {};
    users.forEach(u => { userMap[String(u._id)] = u; });

    let data = challans.map(c => ({
      ...c.toObject(),
      student: userMap[String(c.userId)] || null,
    }));

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(c =>
        c.challanId?.includes(s) ||
        c.psid?.includes(s) ||
        c.student?.fullName?.toLowerCase().includes(s) ||
        c.student?.email?.toLowerCase().includes(s) ||
        c.student?.rollNumber?.toLowerCase().includes(s)
      );
    }

    res.json({ status: "success", data, total });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Mark Challan Paid ──────────────────────────────────────────
exports.markChallanPaid = async (req, res) => {
  try {
    const { challanId, txnId, txnDate } = req.body;
    const challan = await Challan.findOneAndUpdate(
      { challanId },
      { paid: true, txnId: txnId || null, txnDate: txnDate || new Date() },
      { new: true }
    );
    if (!challan) return res.status(404).json({ status: "error", message: "Challan not found" });
    res.json({ status: "success", data: challan });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ── Admin Login ────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "yetp@admin2026";
    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
    res.json({
      status: "success",
      data: {
        token: process.env.ADMIN_API_KEY || "123456789",
        user: { name: "YETP Admin", email: "admin@yetp.pk" },
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
