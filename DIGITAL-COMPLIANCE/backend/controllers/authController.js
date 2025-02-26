const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Teacher = require("../models/Teacher"); // Assuming you have a Teacher model

// Login handler
const login = async (req, res) => {
  const { email, password, role } = req.body; // Include role in request body

  try {
    let user;

    if (role === "teacher") {
      user = await Teacher.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }
    console.log("user", user);
    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );
    console.log("user2", user);
    // Send response with token
    return res.status(200).json({
      message: "Login successful",
      token, // Send token to frontend
      name: user.name,
      role: user.role,
      email: user.email,
      userId: user._id, // Optionally send user data
      ...(user.role === "teacher" ||
      user.role === "class teacher" ||
      user.role === "hod" ||
      user.role === "admin"
        ? {
            subject: user.subject,
            branch: user.branch,
          } // Fields for teachers
        : {
            rollNumber: user.rollNumber,
            branch: user.branch,
            semester: user.semester,
            year: user.year,
            division: user.division,
          }), // Fields for students
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register handler
const register = async (req, res) => {
  const {
    name,
    email,
    password,
    rollNumber,
    branch,
    semester,
    year,
    division,
    role, // Default to "student" if no role is provided
  } = req.body;

  try {
    // Only allow registration for students
    if (role === "teacher") {
      return res.status(400).json({ message: "Teachers cannot register" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Set default role to 'student' if not provided
    const userRole = role || "student";

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user for students
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      branch,
      semester,
      year,
      division,
      role: userRole,
    });

    // Save user to the database
    await newUser.save();

    return res.status(201).json({
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { login, register };
