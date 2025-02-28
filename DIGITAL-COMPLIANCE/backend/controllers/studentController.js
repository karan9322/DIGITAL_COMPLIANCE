const ComplianceForm = require("../models/ComplianceForm");
const User = require("../models/User");

exports.getSubjects = async (req, res) => {
  try {
    console.log(1);
    // Get the student's branch, semester, and year from their data

    // Fetch the student data
    const student = await User.findById(req.user.id);
    const { branch, semester, year } = student;

    console.log(2);
    console.log(student.status.subjects.length);
    // Check if the subjects are already set for the student
    if (student.status.subjects.length === 0) {
      // Fetch the compliance form for the student's branch, semester, and year
      console.log("correct");
      console.log(branch, semester, year);
      const complianceForm = await ComplianceForm.findOne({
        branch,
        semester,
        year,
      });
      console.log(3);
      console.log(complianceForm);

      if (!complianceForm) {
        return res.status(404).json({
          message:
            "Compliance form not found for this branch, semester, or year",
        });
      }
      console.log("hi");
      // Prepare the subjects from the compliance form
      const subjects = complianceForm.subjects.map((subject) => ({
        subjectStatusSchema: subject.name, // Subject name
        marks: "", // Marks are initially empty
        theoryStatus: "pending", // Default status
        practicalStatus: "pending", // Default status
      }));
      console.log("3");
      // Update the student's subjects in the database
      await User.findByIdAndUpdate(req.user.id, {
        "status.subjects": subjects,
      });
    }
    console.log(4);
    // Re-fetch the student after updating to ensure you get the most up-to-date subjects
    const updatedStudent = await User.findById(req.user.id);
    console.log(updatedStudent);
    // Return the student's subjects (either already set or newly set)
    return res.status(200).json({ status: updatedStudent.status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitMarks = async (req, res) => {
  console.log("submitting marks");
  const { subjectId } = req.params;
  const { marks } = req.body; // Expecting prelims marks from the frontend
  console.log(req.body);

  try {
    const userId = req.user.id; // Assuming req.user is set by auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the subject by its name in the user's subjects list
    const subject = user.status.subjects.find(
      (subject) => subject.subjectStatusSchema === subjectId // Compare subject names
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Update the marks field (prelims marks)
    subject.marks = marks || subject.marks; // Update marks with the new value
    console.log(subject.marks);

    await user.save(); // Save the updated user data

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error submitting marks:", error);
    res.status(500).json({ message: "Failed to submit marks" });
  }
};
