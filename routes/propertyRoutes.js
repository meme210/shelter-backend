// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware'); // <-- 1. Hire the Role Bouncer!
const upload = require('../middlewares/uploadMiddleware');
const { 
  createProperty, getAllProperties, rentProperty, 
  uploadHouseImage, updateProperty, deleteProperty 
} = require('../controllers/propertyController');

// 2. Anyone can view properties
router.get('/', getAllProperties);

// 3. LANDLORDS & AGENTS ONLY: Creating, Updating, Deleting, and Uploading Images
router.post('/', verifyToken, authorizeRoles('landlord', 'agent'), createProperty);
router.put('/:id', verifyToken, authorizeRoles('landlord', 'agent'), updateProperty);
router.delete('/:id', verifyToken, authorizeRoles('landlord', 'agent'), deleteProperty);
router.post('/:id/image', verifyToken, authorizeRoles('landlord', 'agent'), upload.single('image'), uploadHouseImage);

// 4. CUSTOMERS ONLY: Renting a property
router.post('/:id/rent', verifyToken, authorizeRoles('customer'), rentProperty);

module.exports = router;