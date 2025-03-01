const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classTeacherRoutes = require("./routes/classTeacherRoutes");
const hodRoutes = require("./routes/hodRoutes");
const dotenv = require("dotenv");
dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: [
    "https://digital-compliance.onrender.com",
    "https://digital-compliance-1-6632.onrender.com",
  ], // Allow both frontend URLs
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/class-teacher", classTeacherRoutes);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
