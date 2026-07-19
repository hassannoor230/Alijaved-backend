import AnalyticsEvent from "../models/AnalyticsEvent.js";

// Public: called once per page load
export const trackVisit = async (req, res) => {
  try {
    await AnalyticsEvent.create({
      type: "visit",
      meta: { page: req.body.page || "/" },
      userAgent: req.headers["user-agent"],
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to log visit", error: err.message });
  }
};

// Public: called when the resume download button is clicked
export const trackResumeDownload = async (req, res) => {
  try {
    await AnalyticsEvent.create({
      type: "resume_download",
      userAgent: req.headers["user-agent"],
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to log resume download", error: err.message });
  }
};

// Public: called when a "View Case Study" / project link is clicked
export const trackProjectClick = async (req, res) => {
  try {
    const { project } = req.body;
    if (!project) return res.status(400).json({ message: "project is required" });
    await AnalyticsEvent.create({
      type: "project_click",
      meta: { project },
      userAgent: req.headers["user-agent"],
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to log project click", error: err.message });
  }
};

// Admin: aggregated numbers for the dashboard
export const getAnalyticsSummary = async (req, res) => {
  try {
    const [totalVisits, totalResumeDownloads, topProjects, monthlyVisits] = await Promise.all([
      AnalyticsEvent.countDocuments({ type: "visit" }),
      AnalyticsEvent.countDocuments({ type: "resume_download" }),
      AnalyticsEvent.aggregate([
        { $match: { type: "project_click" } },
        { $group: { _id: "$meta.project", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, project: "$_id", clicks: 1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { type: "visit" } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            visits: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                { $cond: [{ $lt: ["$_id.month", 10] }, { $concat: ["0", { $toString: "$_id.month" }] }, { $toString: "$_id.month" }] },
              ],
            },
            visits: 1,
          },
        },
      ]),
    ]);

    res.json({ totalVisits, totalResumeDownloads, topProjects, monthlyVisits });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics", error: err.message });
  }
};
