const express = require("express");
const router = express.Router();
const {
  getUsers,
  getAdminStatistics,
  deleteUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/users", protect, admin, getUsers);
router.get("/statistics", protect, admin, getAdminStatistics);
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
