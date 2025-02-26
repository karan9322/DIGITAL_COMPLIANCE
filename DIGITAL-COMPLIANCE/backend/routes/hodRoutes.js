const express = require("express");
const router = express.Router();
const {
  getStudents,
  getAllTeachers,
  assignTeacher,
  getAllClasses,
} = require("../controllers/hodController");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import the middlewares

router.use(protect, authorize("hod"));
// Protect the route and only allow HOD to access it

router.get("/students", getStudents);

// Route to get all classes
router.get("/classes", getAllClasses);
router.get("/teachers", getAllTeachers);

// Route to assign a teacher to a division
router.post("/assign-teacher", assignTeacher);

module.exports = router;
