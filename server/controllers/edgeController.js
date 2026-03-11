const Edge = require("../models/Edge");

// @desc    Get all edges
// @route   GET /api/edges
// @access  Public
const getEdges = async (req, res) => {
  try {
    const edges = await Edge.find().populate("from to", "name lat lng"); // Include location names
    res.json(edges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new edge
// @route   POST /api/edges
// @access  Admin only
const createEdge = async (req, res) => {
  try {
    const { from, to, distance } = req.body;

    // Prevent duplicate edges
    const existing = await Edge.findOne({
      $or: [
        { from, to },
        { from: to, to: from }, // Check reverse direction too
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Edge between these locations already exists" });
    }

    const edge = await Edge.create({ from, to, distance });
    res.status(201).json(edge);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Delete an edge
// @route   DELETE /api/edges/:id
// @access  Admin only
const deleteEdge = async (req, res) => {
  try {
    const edge = await Edge.findByIdAndDelete(req.params.id);
    if (!edge) {
      return res.status(404).json({ message: "Edge not found" });
    }
    res.json({ message: "Edge deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getEdges, createEdge, deleteEdge };
