const express = require("express");
const router = express.Router();
const {
  getStudents,
  getSubjects,
  getTeachers,
  assignTeacher,
} = require("../controllers/classTeacherController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.use(protect, authorize("classTeacher"));

router.get("/subjects", getSubjects);
router.get("/teachers", getTeachers);
router.post("/assign-teacher", assignTeacher);
router.get("/students", getStudents);

module.exports = router;
