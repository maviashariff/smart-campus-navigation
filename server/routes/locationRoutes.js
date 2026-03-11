const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getLocations,
  getLocationById,
  searchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");

// Public routes
router.get("/", getLocations);            // GET /api/locations
router.get("/search", searchLocations);    // GET /api/locations/search?q=library
router.get("/:id", getLocationById);       // GET /api/locations/:id

// Admin-only routes (require JWT token)
router.post("/", protect, createLocation);       // POST /api/locations
router.put("/:id", protect, updateLocation);     // PUT /api/locations/:id
router.delete("/:id", protect, deleteLocation);  // DELETE /api/locations/:id

module.exports = router;
