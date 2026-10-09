const mongoose = require("mongoose");
const dns = require("dns");

// Use Google/Cloudflare DNS to prevent SRV lookup ECONNREFUSED errors on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS cannot be set
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/edupredict";
    await mongoose.connect(mongoURI);

    const isAtlas = mongoURI.includes("mongodb+srv");
    if (isAtlas) {
      console.log("MongoDB Atlas Connected Successfully");
    } else {
      console.log("MongoDB Connected Successfully");
    }
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
