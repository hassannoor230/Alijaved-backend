import mongoose from "mongoose";

// Powers the "Real Results That Drive Growth" band on the homepage
const statSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },  // e.g. "2.8M+"
    prefix: { type: String, default: "" },     // e.g. "$"
    label: { type: String, required: true },   // e.g. "Revenue Generated"
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Stat", statSchema);
