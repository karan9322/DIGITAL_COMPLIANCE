const mongoose = require("mongoose");

const subjectStatusSchema = new mongoose.Schema({
  subjectStatusSchema: { type: String }, // Subject name or ID
  marks: { type: String },
  theoryStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  practicalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNumber: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  division: { type: String, required: true },
  role: { type: String, default: "student" }, // Role field
  status: {
    subjects: {
      type: [subjectStatusSchema],
    },
    classTeacherStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    hodStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
});

// Check if the model is already defined to prevent overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
