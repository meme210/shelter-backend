const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware'); 
const upload = require('../middlewares/uploadMiddleware');
const { 
  createProperty, getAllProperties, rentProperty, 
  uploadHouseImage, updateProperty, deleteProperty 
} = require('../controllers/propertyController');

router.get('/', getAllProperties);

router.post('/', verifyToken, authorizeRoles('landlord', 'agent'), createProperty);
router.put('/:id', verifyToken, authorizeRoles('landlord', 'agent'), updateProperty);
router.delete('/:id', verifyToken, authorizeRoles('landlord', 'agent'), deleteProperty);
router.post('/:id/image', verifyToken, authorizeRoles('landlord', 'agent'), upload.single('image'), uploadHouseImage);


router.post('/:id/rent', verifyToken, authorizeRoles('customer'), rentProperty);

module.exports = router;