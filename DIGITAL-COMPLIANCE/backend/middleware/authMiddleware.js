const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  console.log("protect1");
  // Check if the token is provided in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token, return unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    // Find the user by decoded ID and attach it to the request object
    req.user = await Teacher.findById(decoded.userId);
    console.log("req.user", req.user);
    // If user not found, return an error
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("protect2");
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    // If the user role is not included in the allowed roles
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("auth");
    next(); // Proceed to the next middleware
  };
};

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = { id: user._id }; // Set req.user
    console.log("pass");
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
