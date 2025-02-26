const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  subject: [
    {
      name: { type: String, default: "" }, // Subject Name
      role: { type: String, enum: ["theoryTeacher", "assignmentTeacher"] },
      division: { type: String },
      branch: { type: String },
      year: { type: Number },
      semester: { type: Number },
    },
  ],
  role: {
    type: String,
    enum: ["teacher", "classTeacher", "hod", "admin"],
    default: "teacher",
  },
  branch: {
    type: String,
    default: "",
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
  },
  division: {
    type: String,
    enum: ["A", "B", "C", "D", ""],
    default: "",
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
