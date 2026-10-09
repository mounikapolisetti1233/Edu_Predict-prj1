const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/predictions", require("./routes/predictionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EduPredict API Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("EduPredict API Backend is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
