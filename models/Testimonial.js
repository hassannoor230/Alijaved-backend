import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },     // e.g. "Founder, Glow Skincare"
    quote: { type: String, required: true },
    initials: { type: String, required: true },  // e.g. "AK" for avatar
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
