const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Location type is required"],
      enum: ["academic", "hall", "food", "sports", "accommodation", "entry", "parking", "administrative"],
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    lng: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

// Index for search — makes text search fast
locationSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Location", locationSchema);
