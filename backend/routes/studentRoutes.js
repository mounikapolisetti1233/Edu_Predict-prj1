
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

// All authenticated users can view students.
router
  .route("/")
  .get(protect, getStudents)
  .post(protect, facultyOrAdmin, createStudent);

// All authenticated users can view an individual student.
// Only Faculty/Admin can update or delete records.
router
  .route("/:id")
  .get(protect, getStudentById)
  .put(protect, facultyOrAdmin, updateStudent)
  .delete(protect, facultyOrAdmin, deleteStudent);

module.exports = router;
