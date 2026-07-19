import Stat from "../models/Stat.js";

export const getStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats", error: err.message });
  }
};
