// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import the menus (routes)
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- 1. Import Auth Routes

const app = express();
app.use(express.json());

// Connect to Kitchen (Database)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 The Kitchen is open! Connected to MongoDB."))
  .catch((err) => console.log("🔴 Kitchen error:", err));

// Route Traffic
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes); // <-- 2. Tell the server to use them!

// Start Server
app.listen(3000, () => {
  console.log("🚀 Shelter backend is running on port 3000!");
});