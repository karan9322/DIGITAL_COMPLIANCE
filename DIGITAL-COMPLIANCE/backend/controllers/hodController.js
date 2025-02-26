const User = require("../models/User");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher"); // Assuming you have a Teacher model

exports.assignTeacher = async (req, res) => {
  try {
    const { divisionId, teacherId, year, semester } = req.body;
    console.log("teacherId", semester);

    if (!divisionId || !teacherId || !year) {
      return res
        .status(400)
        .json({ message: "Year, Division ID, and Teacher ID are required." });
    }

    // Find the class based on year and division name
    const classData = await Class.findOne({
      year: year,
      "divisions.name": divisionId,
    });

    if (!classData) {
      return res.status(404).json({ message: "Class or Division not found." });
    }

    // Find the division inside the class
    const division = classData.divisions.find((div) => div.name === divisionId);

    // Update the classTeacher field for the selected division
    division.classTeacher = teacherId;

    // Save the updated class data
    await classData.save();

    // Update the teacher's role to "classTeacher"
    const teacher = await Teacher.findOneAndUpdate(
      { name: teacherId }, // Finding the teacher by name
      {
        role: "classTeacher",
        division: divisionId,
        year: year,
        semester: semester,
      }, // Updating role, division, and year
      { new: true } // To return the updated document
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.status(200).json({
      message: "Teacher assigned successfully and role updated.",
      classData,
      teacher,
    });
  } catch (error) {
    console.error("Error assigning teacher:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get list of students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({
      branch: req.user.branch,
    }); // Adjust based on your schema or filtering
    console.log(students);
    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Final approval for a student
exports.finalApproveStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.status !== "class_teacher_approved") {
      return res
        .status(400)
        .json({ message: "Student not approved by class teacher yet" });
    }

    student.status = "approved"; // Change status to 'approved'
    await student.save();

    res.status(200).json({ message: "Student approved successfully" });
  } catch (err) {
    console.error("Error approving student:", err);
    res.status(500).json({ message: "Failed to approve student" });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const classes = await Class.find({ branch: req.user.branch });
    res.json(classes);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.log(error);
  }
};

// Assign a class teacher to a division
exports.assignClassTeacher = async (req, res) => {
  try {
    const { year, branch, divisionName, teacherId } = req.body;

    // Validate inputs
    if (!year || !branch || !divisionName || !teacherId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Find the class
    const cls = await Class.findOne({ year, branch });
    if (!cls) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find the division inside the class
    const division = cls.divisions.find((div) => div.name === divisionName);
    if (!division) {
      return res.status(404).json({ error: "Division not found" });
    }

    // Assign teacher to the division (assuming you store teacherId in division)
    division.teacher = teacherId;

    // Save the updated class document
    await cls.save();

    res.json({ message: "Teacher assigned successfully" });
  } catch (error) {
    console.error("Error assigning teacher:", error);
    res.status(500).json({ error: "Failed to assign teacher" });
  }
};
