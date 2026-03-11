const jwt = require("jsonwebtoken");

/**
 * Middleware to protect admin-only routes.
 * Checks for a valid JWT token in the Authorization header.
 * Usage: router.post("/admin-route", protect, controllerFunction)
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id; // Attach admin ID to request for later use
    next(); // Token is valid, proceed to the route handler
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;
