// backend/middleware/roleMiddleware.js
const User = require("../models/User");

exports.checkRole = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "admin" && user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
