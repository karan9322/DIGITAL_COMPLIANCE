const express = require("express");
const {
  createComplianceForm,
  createClass,
  getClasses,
  getComplianceForms,
  addTeacher, // Add Teacher controller
  getTeachers, // Get list of teachers controller
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/compliance-forms", createComplianceForm);

router.get("/compliance-forms", getComplianceForms);

router.post("/teachers", addTeacher);

router.get("/teachers", getTeachers);

router.post("/classes", createClass);

router.get("/classes", getClasses);

module.exports = router;
