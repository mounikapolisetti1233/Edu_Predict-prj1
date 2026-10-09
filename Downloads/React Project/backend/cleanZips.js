const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const filesToDelete = ["EduPredict_Project.zip", "EduPredict_Source_Code.zip", "EduPredict_Source_Code.tar.gz"];

filesToDelete.forEach((file) => {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Removed ${file}`);
    } catch (err) {
      console.error(`Could not remove ${file}:`, err.message);
    }
  }
});
