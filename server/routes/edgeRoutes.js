const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getEdges, createEdge, deleteEdge } = require("../controllers/edgeController");

router.get("/", getEdges);                    // GET /api/edges
router.post("/", protect, createEdge);        // POST /api/edges (Admin only)
router.delete("/:id", protect, deleteEdge);   // DELETE /api/edges/:id (Admin only)

module.exports = router;
