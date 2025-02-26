const express = require("express");
const router = express.Router();
const { getStudent } = require("../controllers/teacherController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("teacher"));
// Route to get students for a specific division
router.get("/students/:division", getStudent);
// Route to update compliance form when assigning a teacher

module.exports = router;
