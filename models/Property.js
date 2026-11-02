const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  propertyType: { type: String, enum: ['apartment', 'house'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'rented', 'sold'], default: 'available' },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // --- ADD THIS MISSING PIECE! ---
  images: [{
    url: String,
    mimeType: String,
    size: Number
  }]
});

module.exports = mongoose.model('Property', propertySchema);