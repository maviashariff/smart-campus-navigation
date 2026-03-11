const express = require("express");
const router = express.Router();
const { getShortestPath } = require("../controllers/navigationController");

// GET /api/navigate?from=id1&to=id2
router.get("/", getShortestPath);

module.exports = router;
