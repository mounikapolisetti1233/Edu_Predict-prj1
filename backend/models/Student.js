
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [15, "Age must be at least 15"],
      max: [100, "Age must be valid"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 12,
    },
    previousPercentage: {
      type: Number,
      required: [true, "Previous percentage is required"],
      min: 0,
      max: 100,
    },
    attendancePercentage: {
      type: Number,
      required: [true, "Attendance percentage is required"],
      min: 0,
      max: 100,
    },
    internalMarks: {
      type: Number,
      required: [true, "Internal marks are required"],
      min: 0,
      max: 100,
    },
    assignmentMarks: {
      type: Number,
      required: [true, "Assignment marks are required"],
      min: 0,
      max: 100,
    },
    studyHoursPerDay: {
      type: Number,
      required: [true, "Study hours per day are required"],
      min: 0,
      max: 24,
    },
    backlogs: {
      type: Number,
      required: [true, "Number of backlogs is required"],
      min: 0,
      default: 0,
    },
    participationLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
