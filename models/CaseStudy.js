import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },       // e.g. "E-Commerce"
    title: { type: String, required: true },      // e.g. "Fashion Brand — Sales Campaign"
    description: { type: String, default: "" },
    client: { type: String, default: "" },
    industry: { type: String, default: "" },
    objective: { type: String, default: "" },
    strategy: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    projectUrl: { type: String, default: "" },
    metrics: [
      {
        label: { type: String, required: true },  // e.g. "ROAS"
        value: { type: String, required: true },   // e.g. "14.2x"
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("CaseStudy", caseStudySchema);
