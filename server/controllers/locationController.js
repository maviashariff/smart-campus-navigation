const Location = require("../models/Location");

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 }); // Alphabetical order
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single location by ID
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search locations by name or description
// @route   GET /api/locations/search?q=keyword
// @access  Public
const searchLocations = async (req, res) => {
  try {
    const keyword = req.query.q;
    if (!keyword) {
      return res.status(400).json({ message: "Search query 'q' is required" });
    }

    // Case-insensitive regex search — matches partial names too
    const locations = await Location.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Admin only
const createLocation = async (req, res) => {
  try {
    const { name, type, lat, lng, description } = req.body;

    // Check if location with same name already exists
    const existing = await Location.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Location with this name already exists" });
    }

    const location = await Location.create({ name, type, lat, lng, description });
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Admin only
const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,       // Return updated document
      runValidators: true, // Validate against schema
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Admin only
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getLocations,
  getLocationById,
  searchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};
