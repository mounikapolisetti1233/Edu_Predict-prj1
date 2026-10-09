const Prediction = require("../models/Prediction");
const Student = require("../models/Student");

// Helper function to calculate regression prediction
const calculatePrediction = (academicData) => {
  const {
    previousPercentage,
    attendancePercentage,
    internalMarks,
    assignmentMarks,
    studyHoursPerDay,
    backlogs,
    participationLevel,
  } = academicData;

  const prevWeight = 0.35 * Number(previousPercentage);
  const attWeight = 0.25 * Number(attendancePercentage);
  const intWeight = 0.15 * Number(internalMarks);
  const assWeight = 0.10 * Number(assignmentMarks);
  
  // Study hours bonus: 8 hours per day gives full 15 points
  const hoursBonus = Math.min(15, (Number(studyHoursPerDay) / 8) * 15);

  // Participation bonus
  let partBonus = 1.5;
  if (participationLevel === "High") partBonus = 3;
  if (participationLevel === "Low") partBonus = 0;

  // Backlog penalty: 4 percentage points per backlog
  const backlogPenalty = Number(backlogs) * 4;

  let rawScore = prevWeight + attWeight + intWeight + assWeight + hoursBonus + partBonus - backlogPenalty;
  
  // Clamp score between 0 and 100
  let predictedPercentage = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));

  // Determine Performance Category
  let performanceCategory = "Average";
  if (predictedPercentage >= 85 && Number(backlogs) === 0) {
    performanceCategory = "Excellent";
  } else if (predictedPercentage >= 70 && Number(backlogs) <= 1) {
    performanceCategory = "Good";
  } else if (predictedPercentage >= 55 && Number(backlogs) <= 2) {
    performanceCategory = "Average";
  } else if (predictedPercentage >= 40) {
    performanceCategory = "Needs Improvement";
  } else {
    performanceCategory = "At Risk";
  }

  // Force 'At Risk' if attendance is critical (< 50%) or backlogs >= 3
  if (Number(attendancePercentage) < 50 || Number(backlogs) >= 3) {
    performanceCategory = "At Risk";
  }

  // Generate Custom Recommendations
  const recommendations = [];

  if (performanceCategory === "Excellent") {
    recommendations.push("Outstanding academic consistency! Maintain current study habits and consider mentoring peers or engaging in advanced research projects.");
  } else if (performanceCategory === "Good") {
    recommendations.push("Solid academic performance. To reach an 'Excellent' rating, focus on boosting attendance and refining internal assessment preparation.");
  } else if (performanceCategory === "Average") {
    recommendations.push("Steady performance, but has potential for higher growth. Increase daily study hours to at least 4-5 hours and aim for 85%+ attendance.");
  } else if (performanceCategory === "Needs Improvement") {
    recommendations.push("Academic performance is lagging. Focus immediately on completing all assignments, improving internal exam marks, and reducing backlogs.");
  } else {
    recommendations.push("Immediate academic counseling and intervention recommended. Priority focus needed on clearing backlogs and attending mandatory remedial classes.");
  }

  if (Number(attendancePercentage) < 75) {
    recommendations.push("Attendance is below the mandatory 75% threshold. Ensure regular lecture attendance to avoid hall ticket restriction.");
  }
  if (Number(studyHoursPerDay) < 3) {
    recommendations.push("Daily study duration is low. Dedicate at least 3-4 structured hours daily for self-study and revision.");
  }
  if (Number(backlogs) > 0) {
    recommendations.push(`Clear the ${backlogs} existing active backlog(s) during upcoming supplementary examinations.`);
  }

  return {
    predictedPercentage,
    performanceCategory,
    recommendation: recommendations.join(" "),
  };
};

// @desc    Generate and save student prediction
// @route   POST /api/predictions
// @access  Private
const createPrediction = async (req, res) => {
  try {
    const { studentId, academicData } = req.body;

    let student;
    if (studentId) {
      student = await Student.findById(studentId);
    }

    if (!student && req.body.studentCustomId) {
      student = await Student.findOne({ studentId: req.body.studentCustomId });
    }

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Merge or use provided academic data
    const inputAcademicData = academicData || {
      previousPercentage: student.previousPercentage,
      attendancePercentage: student.attendancePercentage,
      internalMarks: student.internalMarks,
      assignmentMarks: student.assignmentMarks,
      studyHoursPerDay: student.studyHoursPerDay,
      backlogs: student.backlogs,
      participationLevel: student.participationLevel,
    };

    const { predictedPercentage, performanceCategory, recommendation } =
      calculatePrediction(inputAcademicData);

    const prediction = await Prediction.create({
      student: student._id,
      inputAcademicData,
      predictedPercentage,
      performanceCategory,
      recommendation,
      createdBy: req.user ? req.user._id : null,
    });

    // Populate student details
    const populatedPrediction = await Prediction.findById(prediction._id).populate(
      "student",
      "name studentId department email semester"
    );

    res.status(201).json(populatedPrediction);
  } catch (error) {
    console.error("Create Prediction Error:", error);
    res.status(500).json({ message: error.message || "Failed to process prediction" });
  }
};

// @desc    Get all predictions
// @route   GET /api/predictions
// @access  Private
const getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate("student", "name studentId department email semester")
      .sort({ createdAt: -1 });

    res.json(predictions);
  } catch (error) {
    console.error("Get Predictions Error:", error);
    res.status(500).json({ message: "Failed to fetch predictions" });
  }
};

// @desc    Get prediction by ID
// @route   GET /api/predictions/:id
// @access  Private
const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id).populate(
      "student",
      "name studentId department email semester"
    );

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prediction details" });
  }
};

module.exports = {
  createPrediction,
  getPredictions,
  getPredictionById,
};
