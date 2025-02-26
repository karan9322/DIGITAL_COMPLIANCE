const User = require("../models/User");
const Teacher = require("../models/Teacher");
const ComplianceForm = require("../models/ComplianceForm");

// Get all subjects
exports.getSubjects = async (req, res) => {
  console.log("req", req.body);
  try {
    console.log("sub");

    const compliance = await ComplianceForm.find({
      year: req.user.year,
      branch: req.user.branch,
      semester: req.user.semester,
    });
    console.log("compliance", compliance);
    const subjects = compliance.flatMap((c) => c.subjects);
    res.json({ subjects });
    console.log("sub-pass", subjects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching subjects" });
  }
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ error: "Error fetching teachers" });
  }
};

exports.assignTeacher = async (req, res) => {
  const { subjectName, teacherId, role, previousTeacherId } = req.body;
  console.log("data", subjectName, teacherId, role, previousTeacherId);

  try {
    // Find the new teacher
    const newTeacher = await Teacher.findById(teacherId);
    if (!newTeacher) {
      return res.status(404).json({ error: "New teacher not found" });
    }

    // ✅ Remove the subject from the previous teacher's subject array
    if (previousTeacherId && previousTeacherId !== teacherId) {
      console.log("Removing subject from previous teacher:", previousTeacherId);
      await Teacher.findByIdAndUpdate(
        previousTeacherId,
        { $pull: { subject: { name: subjectName } } }, // Removes the entire object
        { new: true }
      );
    }

    // ✅ Check if the subject is already assigned to the new teacher
    const alreadyAssigned = newTeacher.subject.some(
      (s) => s.name === subjectName && s.role === role
    );

    if (!alreadyAssigned) {
      newTeacher.subject.push({
        name: subjectName,
        role,
        branch: newTeacher.branch,
        year: newTeacher.year,
        semester: newTeacher.semester,
      });
      await newTeacher.save();
    }

    res.json({
      message: "Teacher assigned successfully",
      teacher: newTeacher,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error assigning teacher" });
  }
};

// Fetch all students assigned to the class teacher
exports.getStudents = async (req, res) => {
  try {
    console.log("get");

    const students = await User.find({
      branch: req.user.branch,
      year: req.user.year,
      division: req.user.division,
      semester: req.user.semester,
    }).select("name rollNumber status");
    res.status(200).json({ students });
    console.log("stu-pass");
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
};
