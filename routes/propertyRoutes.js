// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // <-- Hiring the Porter
const { createProperty, getAllProperties, rentProperty, uploadHouseImage, updateProperty, deleteProperty } = require('../controllers/propertyController');

router.get('/', getAllProperties);
router.post('/', verifyToken, createProperty);
router.post('/:id/rent', verifyToken, rentProperty);
router.put('/:id', verifyToken, updateProperty);
router.delete('/:id', verifyToken, deleteProperty);

// BRAND NEW: Notice how we have TWO bouncers here! 
// verifyToken checks the wristband, upload.single('image') catches the package.
router.post('/:id/image', verifyToken, upload.single('image'), uploadHouseImage);

module.exports = router;