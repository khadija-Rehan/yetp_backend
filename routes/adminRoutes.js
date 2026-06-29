const express = require("express");
const adminApiKeyMiddleware = require("../middleware/adminApiKeyMiddleware");
const { adminGenerateAndSendPDF } = require("../controllers/userController");
const {
  getDashboardStats, getMonthlyStats,
  getAllStudents, getStudentById, updateStudent, deleteStudent, updateTestScore,
  getAllChallans, markChallanPaid,
  adminLogin,
} = require("../controllers/adminController");

const router = express.Router();

// Public — admin login (no API key needed)
router.post("/login", adminLogin);

// All other routes require API key
router.use(adminApiKeyMiddleware);

// Dashboard
router.get("/dashboard-stats", getDashboardStats);
router.get("/monthly-stats",   getMonthlyStats);

// Students
router.get("/students",              getAllStudents);
router.get("/students/:id",          getStudentById);
router.put("/students/:id",          updateStudent);
router.delete("/students/:id",       deleteStudent);
router.patch("/students/:id/test",   updateTestScore);

// Challans
router.get("/challans",              getAllChallans);
router.post("/challans/mark-paid",   markChallanPaid);
router.post("/generate-pdf",         adminGenerateAndSendPDF);

module.exports = router;
