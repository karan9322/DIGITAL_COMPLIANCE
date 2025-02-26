const express = require("express");
const {
  getSubjects,
  submitMarks,
} = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Import the auth middleware
const router = express.Router();

router.use(authMiddleware);

// Route to get subjects (this will also set subjects if they are not set yet)
router.get("/subjects", getSubjects);

// Route to submit marks for a subject
router.post("/marks/:subjectId", submitMarks);

module.exports = router;
