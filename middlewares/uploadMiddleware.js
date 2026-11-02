// middlewares/uploadMiddleware.js
const multer = require('multer');

const storage = multer.diskStorage({
  // 1. Where to put the physical file
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Puts it in the folder you just made!
  },
  // 2. What to name the file
  filename: function (req, file, cb) {
    // Adds a timestamp to the name so "house.jpg" becomes "170000000-house.jpg"
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// We only accept single files named 'image' from the frontend
const upload = multer({ storage: storage });

module.exports = upload;