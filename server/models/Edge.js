const mongoose = require("mongoose");

const edgeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Source location is required"],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Destination location is required"],
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Edge", edgeSchema);
