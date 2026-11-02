// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import the menus (routes)
const propertyRoutes = require('./routes/propertyRoutes');
const User = require('./models/User'); 
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Connect to Kitchen
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 The Kitchen is open! Connected to MongoDB."))
  .catch((err) => console.log("🔴 Kitchen error:", err));

// Use the routes! 
// This tells Express: "Any URL that starts with /api/properties, hand it over to propertyRoutes"
app.use('/api/properties', propertyRoutes);

// (Keeping login/register here temporarily to save time, but normally these go in an authRoutes.js file!)
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password) return res.status(401).json({ error: "Wrong credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(3000, () => {
  console.log("🚀 Shelter backend is running on port 3000!");
});