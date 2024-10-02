// utils/multer.js
const multer = require("multer");
const path = require("path");

const multerUploads = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new AppError("Only images are allowed", 400), false);
    }
    cb(null, true);
  },
}).single("profileImage");

const dataUri = (req) => {
  const file = req.file;
  return {
    content: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
  };
};

module.exports = { multerUploads, dataUri };
