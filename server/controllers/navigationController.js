const Location = require("../models/Location");
const Edge = require("../models/Edge");
const dijkstra = require("../utils/dijkstra");

// @desc    Find shortest path between two locations
// @route   GET /api/navigate?from=locationId&to=locationId
// @access  Public
const getShortestPath = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate inputs
    if (!from || !to) {
      return res.status(400).json({ message: "Both 'from' and 'to' location IDs are required" });
    }

    if (from === to) {
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    }

    // Verify both locations exist
    const [source, destination] = await Promise.all([
      Location.findById(from),
      Location.findById(to),
    ]);

    if (!source) return res.status(404).json({ message: "Source location not found" });
    if (!destination) return res.status(404).json({ message: "Destination location not found" });

    // Fetch all edges and build adjacency list (graph)
    const edges = await Edge.find();
    const graph = {};

    // Initialize empty adjacency list for all locations
    const allLocations = await Location.find();
    for (const loc of allLocations) {
      graph[loc._id.toString()] = [];
    }

    // Populate adjacency list — bidirectional (undirected graph)
    for (const edge of edges) {
      const fromId = edge.from.toString();
      const toId = edge.to.toString();

      graph[fromId].push({ node: toId, distance: edge.distance });
      graph[toId].push({ node: fromId, distance: edge.distance }); // Reverse direction
    }

    // Run Dijkstra's algorithm
    const result = dijkstra(graph, from, to);

    if (!result) {
      return res.status(404).json({ message: "No path found between these locations" });
    }

    // Fetch full location details for each node in the path
    const pathLocations = await Location.find({
      _id: { $in: result.path },
    });

    // Sort pathLocations in the order of the path
    const orderedPath = result.path.map((id) =>
      pathLocations.find((loc) => loc._id.toString() === id)
    );

    res.json({
      source: source.name,
      destination: destination.name,
      distance: result.distance,
      unit: "meters",
      path: orderedPath, // Full location objects in route order
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getShortestPath };
