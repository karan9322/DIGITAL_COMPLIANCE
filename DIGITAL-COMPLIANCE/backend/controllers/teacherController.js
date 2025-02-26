const User = require("../models/User"); // Import your User model

exports.getStudent = (req, res) => {
  const division = req.params.division; // Extract division from the URL
  console.log("ka", req.user);
  // Query the User model to find users with the specified division
  User.find({ division, year: req.user.year, branch: req.user.branch })
    .then((students) => {
      if (students.length > 0) {
        res.json(students); // Send the list of students
      } else {
        res
          .status(404)
          .json({ message: "No students found for this division" });
      }
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
      res.status(500).json({ message: err });
    });
};
