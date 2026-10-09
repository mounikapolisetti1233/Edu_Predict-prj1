const express = require("express");
const router = express.Router();
const {
  createPrediction,
  getPredictions,
  getPredictionById,
} = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createPrediction).get(protect, getPredictions);
router.route("/:id").get(protect, getPredictionById);

module.exports = router;
