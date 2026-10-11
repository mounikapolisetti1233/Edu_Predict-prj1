
const Student = require("../models/Student");
const Prediction = require("../models/Prediction");

// GET /api/students
// Fetch students with optional search and department filters.
const getStudents = async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      query.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { email: searchRegex },
      ];
    }

    if (department && department !== "All Departments") {
      query.department = department;
    }

    const students = await Student.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json(students);
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Get Student Error:", error);

    return res.status(500).json({
      message: "Error fetching student details",
    });
  }
};

// POST /api/students
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

    const requiredFields = {
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
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    const numericFields = {
      age: Number(age),
      semester: Number(semester),
      previousPercentage: Number(previousPercentage),
      attendancePercentage: Number(attendancePercentage),
      internalMarks: Number(internalMarks),
      assignmentMarks: Number(assignmentMarks),
      studyHoursPerDay: Number(studyHoursPerDay),
      backlogs: Number(backlogs),
    };

    for (const [field, value] of Object.entries(numericFields)) {
      if (!Number.isFinite(value)) {
        return res.status(400).json({
          message: `${field} must be a valid number`,
        });
      }
    }

    if (numericFields.previousPercentage < 0 ||
        numericFields.previousPercentage > 100) {
      return res.status(400).json({
        message: "Previous percentage must be between 0 and 100",
      });
    }

    if (numericFields.attendancePercentage < 0 ||
        numericFields.attendancePercentage > 100) {
      return res.status(400).json({
        message: "Attendance percentage must be between 0 and 100",
      });
    }

    if (numericFields.internalMarks < 0 ||
        numericFields.internalMarks > 100) {
      return res.status(400).json({
        message: "Internal marks must be between 0 and 100",
      });
    }

    if (numericFields.assignmentMarks < 0 ||
        numericFields.assignmentMarks > 100) {
      return res.status(400).json({
        message: "Assignment marks must be between 0 and 100",
      });
    }

    if (numericFields.studyHoursPerDay < 0 ||
        numericFields.studyHoursPerDay > 24) {
      return res.status(400).json({
        message: "Study hours must be between 0 and 24",
      });
    }

    if (numericFields.backlogs < 0) {
      return res.status(400).json({
        message: "Backlogs cannot be negative",
      });
    }

    if (numericFields.age < 15 || numericFields.age > 100) {
      return res.status(400).json({
        message: "Age must be between 15 and 100",
      });
    }

    if (numericFields.semester < 1 ||
        numericFields.semester > 12 ||
        !Number.isInteger(numericFields.semester)) {
      return res.status(400).json({
        message: "Semester must be an integer between 1 and 12",
      });
    }

    const normalizedStudentId = studentId.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingStudent = await Student.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudent) {
      return res.status(409).json({
        message: `Student ID '${normalizedStudentId}' already exists`,
      });
    }

    const student = await Student.create({
      studentId: normalizedStudentId,
      name: name.trim(),
      age: numericFields.age,
      gender,
      email: normalizedEmail,
      department: department.trim(),
      semester: numericFields.semester,
      previousPercentage: numericFields.previousPercentage,
      attendancePercentage: numericFields.attendancePercentage,
      internalMarks: numericFields.internalMarks,
      assignmentMarks: numericFields.assignmentMarks,
      studyHoursPerDay: numericFields.studyHoursPerDay,
      backlogs: numericFields.backlogs,
      participationLevel: participationLevel || "Medium",
      createdBy: req.user._id,
    });

    return res.status(201).json(student);
  } catch (error) {
    console.error("Create Student Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This Student ID already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to create student record",
      error: error.message,
    });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const allowedFields = [
      "studentId",
      "name",
      "age",
      "gender",
      "email",
      "department",
      "semester",
      "previousPercentage",
      "attendancePercentage",
      "internalMarks",
      "assignmentMarks",
      "studyHoursPerDay",
      "backlogs",
      "participationLevel",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    }

    if (student.email) {
      student.email = student.email.trim().toLowerCase();
    }

    const updatedStudent = await student.save();

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Update Student Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Student ID already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update student",
    });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await Prediction.deleteMany({
      student: student._id,
    });

    await student.deleteOne();

    return res.status(200).json({
      message: "Student and associated predictions deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      message: "Failed to delete student",
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
