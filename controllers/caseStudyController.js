import CaseStudy from "../models/CaseStudy.js";

export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ order: 1 });
    res.json(caseStudies);
  } catch (err) {
    res.status(500).json({ message: "Failed to load case studies", error: err.message });
  }
};

export const createCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.create(req.body);
    res.status(201).json(caseStudy);
  } catch (err) {
    res.status(400).json({ message: "Failed to create case study", error: err.message });
  }
};

export const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!caseStudy) return res.status(404).json({ message: "Case study not found" });
    res.json(caseStudy);
  } catch (err) {
    res.status(400).json({ message: "Failed to update case study", error: err.message });
  }
};

export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: "Case study not found" });
    res.json({ message: "Case study deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete case study", error: err.message });
  }
};
