const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Student = require("./models/Student");
const Prediction = require("./models/Prediction");
const connectDB = require("./config/db");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@edupredict.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminName = process.env.ADMIN_NAME || "System Admin";

    // Check if admin user exists
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminUser) {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: "Admin",
      });
      console.log(`Admin account created successfully: ${adminEmail}`);
    } else {
      console.log(`Admin account already exists: ${adminEmail}`);
    }

    // Check if demo students exist; if not, create sample student records
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log("Seeding sample student records and predictions...");
      const sampleStudents = [
        {
          studentId: "STU1001",
          name: "Alex Rivera",
          age: 20,
          gender: "Male",
          email: "alex.r@univ.edu",
          department: "Computer Science",
          semester: 5,
          previousPercentage: 88,
          attendancePercentage: 92,
          internalMarks: 85,
          assignmentMarks: 90,
          studyHoursPerDay: 6,
          backlogs: 0,
          participationLevel: "High",
          createdBy: adminUser._id,
        },
        {
          studentId: "STU1002",
          name: "Sophia Chen",
          age: 21,
          gender: "Female",
          email: "sophia.c@univ.edu",
          department: "Data Science",
          semester: 6,
          previousPercentage: 74,
          attendancePercentage: 80,
          internalMarks: 76,
          assignmentMarks: 82,
          studyHoursPerDay: 4,
          backlogs: 0,
          participationLevel: "Medium",
          createdBy: adminUser._id,
        },
        {
          studentId: "STU1003",
          name: "Marcus Johnson",
          age: 22,
          gender: "Male",
          email: "marcus.j@univ.edu",
          department: "Information Technology",
          semester: 7,
          previousPercentage: 58,
          attendancePercentage: 65,
          internalMarks: 60,
          assignmentMarks: 62,
          studyHoursPerDay: 2.5,
          backlogs: 2,
          participationLevel: "Low",
          createdBy: adminUser._id,
        },
        {
          studentId: "STU1004",
          name: "Emily Davis",
          age: 19,
          gender: "Female",
          email: "emily.d@univ.edu",
          department: "Electronics & Comm",
          semester: 3,
          previousPercentage: 42,
          attendancePercentage: 48,
          internalMarks: 45,
          assignmentMarks: 50,
          studyHoursPerDay: 1.5,
          backlogs: 3,
          participationLevel: "Low",
          createdBy: adminUser._id,
        },
      ];

      const createdStudents = await Student.insertMany(sampleStudents);

      // Create sample predictions for demo
      for (const s of createdStudents) {
        let cat = "Average";
        if (s.previousPercentage >= 85) cat = "Excellent";
        else if (s.previousPercentage >= 70) cat = "Good";
        else if (s.attendancePercentage < 50 || s.backlogs >= 3) cat = "At Risk";
        else if (s.previousPercentage < 55) cat = "Needs Improvement";

        await Prediction.create({
          student: s._id,
          inputAcademicData: {
            previousPercentage: s.previousPercentage,
            attendancePercentage: s.attendancePercentage,
            internalMarks: s.internalMarks,
            assignmentMarks: s.assignmentMarks,
            studyHoursPerDay: s.studyHoursPerDay,
            backlogs: s.backlogs,
            participationLevel: s.participationLevel,
          },
          predictedPercentage: s.previousPercentage,
          performanceCategory: cat,
          recommendation: `Initial prediction generated during system setup for ${s.name}.`,
          createdBy: adminUser._id,
        });
      }
      console.log("Sample student records and predictions seeded successfully.");
    }

    console.log("Seed script completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
