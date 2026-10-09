const User = require("../models/User");
const Student = require("../models/Student");
const Prediction = require("../models/Prediction");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc    Get admin database statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
const getAdminStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalPredictions = await Prediction.countDocuments();

    // Category breakdown from predictions
    const categoryStats = await Prediction.aggregate([
      {
        $group: {
          _id: "$performanceCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryBreakdown = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      "Needs Improvement": 0,
      "At Risk": 0,
    };

    categoryStats.forEach((stat) => {
      if (categoryBreakdown.hasOwnProperty(stat._id)) {
        categoryBreakdown[stat._id] = stat.count;
      }
    });

    // Department breakdown from students
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          avgAttendance: { $avg: "$attendancePercentage" },
          avgPreviousPercentage: { $avg: "$previousPercentage" },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalPredictions,
      categoryBreakdown,
      departmentStats,
    });
  } catch (error) {
    console.error("Get Statistics Error:", error);
    res.status(500).json({ message: "Failed to fetch admin statistics" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await user.deleteOne();
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getUsers,
  getAdminStatistics,
  deleteUser,
};
