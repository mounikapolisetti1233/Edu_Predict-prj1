const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");
const { facultyOrAdmin } = require("../middleware/facultyMiddleware");

// ==========================================
// STUDENT ROUTES
// Faculty and Admin only
// ==========================================

// Get all students
// Create a new student
router
  .route("/")
  .get(protect, facultyOrAdmin, getStudents)
  .post(protect, facultyOrAdmin, createStudent);

// Get one student
// Update one student
// Delete one student
router
  .route("/:id")
  .get(protect, facultyOrAdmin, getStudentById)
  .put(protect, facultyOrAdmin, updateStudent)
  .delete(protect, facultyOrAdmin, deleteStudent);

module.exports = router;