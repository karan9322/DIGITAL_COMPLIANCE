const mongoose = require("mongoose");

const complianceFormSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      name: { type: String }, // Subject name
      theoryTeacher: { type: String, default: "" }, // Name of the theory teacher
      assignmentTeacher: { type: String, default: "" }, // Name of the assignment teacher
    },
  ],
});

const ComplianceForm = mongoose.model("ComplianceForm", complianceFormSchema);

module.exports = ComplianceForm;
