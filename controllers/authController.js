const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(400).json({ error: "Could not register user. Email might be taken!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Bouncer says: Wrong email or password!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,            
      { expiresIn: '1d' }                
    );

    res.json({ message: "Login successful!", token, role: user.role });
  } catch (error) {
    console.log("CRASH REASON:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { register, login };