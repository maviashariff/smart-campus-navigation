const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables FIRST — before anything else uses them
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());              // Allow cross-origin requests from React frontend
app.use(express.json());      // Parse JSON request bodies

// API Routes
app.use("/api/locations", require("./routes/locationRoutes"));
app.use("/api/edges", require("./routes/edgeRoutes"));
app.use("/api/navigate", require("./routes/navigationRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Health check route — useful for testing if server is running
app.get("/", (req, res) => {
  res.json({ message: "Smart Campus Navigation API is running" });
});

// Handle 404 — any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
