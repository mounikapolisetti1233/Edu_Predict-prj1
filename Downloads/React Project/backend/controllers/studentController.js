const Student = require("../models/Student");
const Prediction = require("../models/Prediction");

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = department;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student details" });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      age,
      gender,
      email,
      department,
      semester,
      previousPercentage,
      attendancePercentage,
      internalMarks,
      assignmentMarks,
      studyHoursPerDay,
      backlogs,
      participationLevel,
    } = req.body;

    // Validation
    if (
      !studentId ||
      !name ||
      age === undefined ||
      !gender ||
      !email ||
      !department ||
      !semester ||
      previousPercentage === undefined ||
      attendancePercentage === undefined ||
      internalMarks === undefined ||
      assignmentMarks === undefined ||
      studyHoursPerDay === undefined ||
      backlogs === undefined
    ) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Range checks
    if (previousPercentage < 0 || previousPercentage > 100) {
      return res.status(400).json({ message: "Previous percentage must be between 0 and 100" });
    }
    if (attendancePercentage < 0 || attendancePercentage > 100) {
      return res.status(400).json({ message: "Attendance percentage must be between 0 and 100" });
    }
    if (internalMarks < 0 || internalMarks > 100) {
      return res.status(400).json({ message: "Internal marks must be between 0 and 100" });
    }
    if (assignmentMarks < 0 || assignmentMarks > 100) {
      return res.status(400).json({ message: "Assignment marks must be between 0 and 100" });
    }
    if (studyHoursPerDay < 0 || studyHoursPerDay > 24) {
      return res.status(400).json({ message: "Study hours must be between 0 and 24" });
    }
    if (backlogs < 0) {
      return res.status(400).json({ message: "Backlogs cannot be negative" });
    }

    // Check duplicate studentId
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: `Student ID '${studentId}' already exists` });
    }

    const student = await Student.create({
      studentId,
      name,
      age: Number(age),
      gender,
      email,
      department,
      semester: Number(semester),
      previousPercentage: Number(previousPercentage),
      attendancePercentage: Number(attendancePercentage),
      internalMarks: Number(internalMarks),
      assignmentMarks: Number(assignmentMarks),
      studyHoursPerDay: Number(studyHoursPerDay),
      backlogs: Number(backlogs),
      participationLevel: participationLevel || "Medium",
      createdBy: req.user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ message: error.message || "Failed to create student record" });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check duplicate studentId if changed
    if (req.body.studentId && req.body.studentId !== student.studentId) {
      const duplicate = await Student.findOne({ studentId: req.body.studentId });
      if (duplicate) {
        return res.status(400).json({ message: "Student ID already exists for another student" });
      }
    }

    Object.assign(student, req.body);
    const updatedStudent = await student.save();

    res.json(updatedStudent);
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ message: error.message || "Failed to update student" });
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete related predictions
    await Prediction.deleteMany({ student: student._id });
    await student.deleteOne();

    res.json({ message: "Student and associated predictions deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
