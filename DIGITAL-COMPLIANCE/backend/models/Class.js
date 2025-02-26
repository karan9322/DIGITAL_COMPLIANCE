const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  year: { type: Number, required: true, min: 1, max: 4 },
  branch: { type: String, required: true },
  divisions: [
    {
      name: { type: String, required: true },
      classTeacher: { type: String },
      subDivisions: [
        { name: { type: String, required: true }, mentor: { type: String } },
      ],
    },
  ],
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
