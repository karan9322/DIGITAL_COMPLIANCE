const ComplianceForm = require("../models/ComplianceForm");
const Teacher = require("../models/Teacher"); // Assuming you have a Teacher model
const bcrypt = require("bcryptjs");

// controllers/classController.js
const Class = require("../models/Class");

// Create a new class
const createClass = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { year, branch, divisions } = req.body;

    // Ensure subDivisions is always an array
    const sanitizedDivisions = divisions.map((division) => ({
      ...division,
      subDivisions: Array.isArray(division.subDivisions)
        ? division.subDivisions
        : [],
    }));
    console.log("sanitizedDivisions", sanitizedDivisions);

    // Check if a class with the same year and branch already exists
    const existingClass = await Class.findOne({ year, branch });

    if (existingClass) {
      return res.status(400).json({
        message: "Class with the same year and branch already exists.",
      });
    }

    // Create and save the new class
    const newClass = new Class({
      year,
      branch,
      divisions: sanitizedDivisions,
    });
    console.log("new class", newClass);

    await newClass.save();
    res.status(201).json({ message: "Class created successfully", newClass });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create class", error: error.message });
  }
};

// Get all classes
const getClasses = async (req, res) => {
  try {
    console.log("getClass");
    const classes = await Class.find();
    console.log("classes", classes);
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Add a new teacher
// Add a new teacher
const addTeacher = async (req, res) => {
  const {
    name,
    email,
    branch,
    password,
    subject,
    role,
    year,
    semester,
    division,
  } = req.body; // Added password field
  console.log("add", req.body);
  try {
    // Validate required fields
    console.log(1);
    if (!name || !email || !branch || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    console.log(1);
    // Check if teacher already exists
    console.log(email);
    const existingTeacher = await Teacher.findOne({ email });
    console.log("ecc");
    if (existingTeacher) {
      console.log("exist");
      return res.status(400).json({ message: "Teacher already exists!" });
    }
    console.log("2");

    // Hash password before saving (if authentication is implemented)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hi");
    // Create new teacher
    const newTeacher = new Teacher({
      name,
      email,
      branch,
      subject,
      role,
      semester,
      division,
      year,
      password: hashedPassword, // Save hashed password
    });
    console.log("save");
    await newTeacher.save();
    res.status(201).json({
      message: "Teacher added successfully",
      teacher: {
        name: newTeacher.name,
        email: newTeacher.email,
        department: newTeacher.branch,
      },
    });
  } catch (error) {
    console.error("Error adding teacher:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the list of all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find(); // Get all teachers
    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a compliance form
const createComplianceForm = async (req, res) => {
  const { year, branch, semester, subjects } = req.body;

  if (!year || !branch || !semester) {
    return res
      .status(400)
      .json({ message: "Year, branch, and semester are required." });
  }

  try {
    const complianceForm = new ComplianceForm({
      year,
      branch,
      semester,
      subjects, // Initialize with an empty array for subjects
    });

    await complianceForm.save();

    res.status(201).json({
      success: true,
      message: "Compliance form created successfully",
      complianceForm,
    });
  } catch (error) {
    console.error("Error creating compliance form:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all compliance forms
const getComplianceForms = async (req, res) => {
  try {
    const complianceForms = await ComplianceForm.find({})
      .populate({
        path: "subjects",
        populate: {
          path: "teachers",
          select: "name", // Only fetch teacher names
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      complianceForms,
    });
  } catch (error) {
    console.error("Error fetching compliance forms:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update compliance form with manually filled subjects and teachers
const updateComplianceForm = async (req, res) => {
  const { id } = req.params; // Get form ID from route parameters
  const { subjects } = req.body; // Get subjects array from request body

  // Ensure subjects array is provided
  if (!subjects || subjects.length === 0) {
    return res.status(400).json({ message: "Subjects array is required" });
  }

  try {
    // Find the compliance form by its ID
    const form = await ComplianceForm.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Compliance form not found" });
    }

    // Manually populate the subjects with subject names and teacher names as provided in the request
    form.subjects = subjects.map((subject) => ({
      name: subject.name, // Subject name (manually filled)
      theoryTeacher: subject.theoryTeacher, // Theory teacher (manually filled)
      assignmentTeacher: subject.assignmentTeacher, // Assignment teacher (manually filled)
    }));

    // Save the updated form
    await form.save();

    // Respond with the updated compliance form
    res.status(200).json({
      success: true,
      message: "Compliance form updated successfully",
      updatedForm: form,
    });
  } catch (error) {
    console.error("Error updating compliance form:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createClass,
  getClasses,
  addTeacher,
  getTeachers,
  createComplianceForm,
  getComplianceForms,
  updateComplianceForm,
};
