/**
 * Dijkstra's Algorithm — finds shortest path between two nodes in a weighted graph.
 *
 * How it works:
 * 1. Start at source node, set its distance to 0, all others to Infinity
 * 2. Visit the unvisited node with smallest distance
 * 3. Update distances of its neighbors if a shorter path is found
 * 4. Repeat until destination is reached or all nodes visited
 *
 * @param {Object} graph - Adjacency list: { nodeId: [{ node: neighborId, distance: num }] }
 * @param {String} start - Starting node ID
 * @param {String} end - Destination node ID
 * @returns {Object} - { path: [nodeIds], distance: totalDistance } or null if no path exists
 */
function dijkstra(graph, start, end) {
  const distances = {}; // Shortest known distance from start to each node
  const previous = {};  // Previous node in optimal path (for backtracking)
  const visited = new Set();
  const nodes = new Set(Object.keys(graph));

  // Step 1: Initialize all distances to Infinity, source to 0
  for (const node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  // Step 2: Process nodes one by one
  while (nodes.size > 0) {
    // Pick unvisited node with smallest distance (greedy choice)
    let current = null;
    for (const node of nodes) {
      if (!visited.has(node)) {
        if (current === null || distances[node] < distances[current]) {
          current = node;
        }
      }
    }

    // No reachable nodes left
    if (current === null || distances[current] === Infinity) break;

    // Reached destination — stop early (optimization)
    if (current === end) break;

    visited.add(current);
    nodes.delete(current);

    // Step 3: Update neighbors' distances
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      const newDist = distances[current] + neighbor.distance;

      // Found a shorter path? Update it
      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        previous[neighbor.node] = current;
      }
    }
  }

  // Step 4: Backtrack from end to start to build the path
  if (distances[end] === Infinity) {
    return null; // No path exists — destination is unreachable
  }

  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    distance: Math.round(distances[end]), // Total distance in meters
  };
}

module.exports = dijkstra;
