// Run with: npm run seed
// Populates MongoDB with the same demo data the frontend originally shipped with.
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import CaseStudy from "./models/CaseStudy.js";
import Testimonial from "./models/Testimonial.js";
import Stat from "./models/Stat.js";
import mongoose from "mongoose";

dotenv.config();

const caseStudies = [
  {
    tag: "E-Commerce",
    title: "Fashion Brand — Sales Campaign",
    metrics: [
      { label: "ROAS", value: "14.2x" },
      { label: "Revenue", value: "$318K" },
      { label: "Purchases", value: "2,451" },
    ],
    order: 1,
  },
  {
    tag: "Lead Generation",
    title: "Real Estate — Lead Generation",
    metrics: [
      { label: "Leads", value: "1,216" },
      { label: "Cost/Lead", value: "$4.35" },
      { label: "Conv. Rate", value: "23%" },
    ],
    order: 2,
  },
  {
    tag: "Brand Awareness",
    title: "Fitness Brand — Awareness Campaign",
    metrics: [
      { label: "Reach", value: "4.7M" },
      { label: "Engagement", value: "178K" },
      { label: "Recall Lift", value: "35%" },
    ],
    order: 3,
  },
];

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Founder, Glow Skincare",
    quote: "Amazing experience — our sales grew by 300% within three months of running his Meta ad strategy.",
    initials: "AK",
    order: 1,
    status: "approved",
  },
  {
    name: "Bilal Ahmed",
    role: "CEO, Urban Wear",
    quote: "He truly understands performance marketing — clear communication and results you can actually measure.",
    initials: "BA",
    order: 2,
    status: "approved",
  },
  {
    name: "Sara Malik",
    role: "Marketing Manager, Real Estate Co.",
    quote: "Professional, dedicated and completely results-driven. Highly recommended for any brand serious about growth.",
    initials: "SM",
    order: 3,
    status: "approved",
  },
  {
    name: "Hamza Tariq",
    role: "Owner, Tariq Electronics",
    quote: "Submitted here to show what a pending review looks like before admin approval.",
    initials: "HT",
    order: 4,
    status: "pending",
  },
];

const stats = [
  { prefix: "$", value: "2.8M+", label: "Revenue Generated", order: 1 },
  { value: "18.6x", label: "Average ROAS", order: 2 },
  { value: "50M+", label: "People Reached", order: 3 },
  { value: "2,500+", label: "Leads Generated", order: 4 },
];

const run = async () => {
  await connectDB();
  await CaseStudy.deleteMany();
  await Testimonial.deleteMany();
  await Stat.deleteMany();
  await CaseStudy.insertMany(caseStudies);
  await Testimonial.insertMany(testimonials);
  await Stat.insertMany(stats);
  console.log("Database seeded successfully");
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
