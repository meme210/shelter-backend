require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes'); 
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 The Kitchen is open! Connected to MongoDB."))
  .catch((err) => console.log("🔴 Kitchen error:", err));

app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes); 

app.listen(3000, () => {
  console.log("🚀 Shelter backend is running on port 3000!");
});