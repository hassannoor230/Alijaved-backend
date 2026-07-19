import Testimonial from "../models/Testimonial.js";

// Public: only approved testimonials, for the live portfolio page
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to load testimonials", error: err.message });
  }
};

// Public: visitor submits a review — always starts as "pending"
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, quote } = req.body;
    if (!name || !role || !quote) {
      return res.status(400).json({ message: "Name, role and quote are required" });
    }
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const testimonial = await Testimonial.create({
      name,
      role,
      quote,
      initials,
      status: "pending",
    });
    res.status(201).json({
      message: "Thanks! Your review has been submitted and will appear once approved.",
      testimonial,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit testimonial", error: err.message });
  }
};

// Admin: every testimonial regardless of status
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to load testimonials", error: err.message });
  }
};

// Admin: approve or reject a pending testimonial
export const setTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be pending, approved or rejected" });
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (err) {
    res.status(400).json({ message: "Failed to update testimonial", error: err.message });
  }
};

// Admin: delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete testimonial", error: err.message });
  }
};
