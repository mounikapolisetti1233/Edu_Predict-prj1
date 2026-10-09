const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    inputAcademicData: {
      previousPercentage: { type: Number, required: true },
      attendancePercentage: { type: Number, required: true },
      internalMarks: { type: Number, required: true },
      assignmentMarks: { type: Number, required: true },
      studyHoursPerDay: { type: Number, required: true },
      backlogs: { type: Number, required: true },
      participationLevel: { type: String, default: "Medium" },
    },
    predictedPercentage: {
      type: Number,
      required: true,
    },
    performanceCategory: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Needs Improvement", "At Risk"],
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    predictionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);
