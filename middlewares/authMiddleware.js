// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Bouncer says: No wristband, no entry!" });

  try {
    const cleanToken = token.replace("Bearer ", "");
    req.user = jwt.verify(cleanToken, process.env.JWT_SECRET);
    next(); 
  } catch (error) {
    res.status(401).json({ error: "Bouncer says: Fake or expired wristband!" });
  }
};

module.exports = verifyToken; // Exports the bouncer so other files can hire them