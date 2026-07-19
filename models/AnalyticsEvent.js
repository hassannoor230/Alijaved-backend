import mongoose from "mongoose";

// A single lightweight collection for all trackable events.
// type: "visit"           -> a page view/session
// type: "resume_download" -> resume download button clicked
// type: "project_click"   -> a "View Case Study" click, meta.project holds the name
const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["visit", "resume_download", "project_click"],
      required: true,
    },
    meta: {
      project: { type: String },   // populated for project_click events
      page: { type: String },      // populated for visit events, e.g. "/"
    },
    userAgent: { type: String },
  },
  { timestamps: true }
);

analyticsEventSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
