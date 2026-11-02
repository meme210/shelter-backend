// controllers/propertyController.js
const Property = require('../models/Property');

// Logic for creating a house
const createProperty = async (req, res) => {
  try {
    const houseData = { ...req.body, owner: req.user.id };
    const newHouse = await Property.create(houseData); 
    res.status(201).json({ message: "House saved SECURELY!", house: newHouse });
  } catch (error) {
    res.status(400).json({ error: "Kitchen Manager rejected it." });
  }
};

// Logic for viewing all houses
const getAllProperties = async (req, res) => {
  const allHouses = await Property.find();
  res.json(allHouses);
};

// --- BRAND NEW RENT FEATURE ---
const rentProperty = async (req, res) => {
  try {
    // 1. Find the specific house by the ID in the URL
    const house = await Property.findById(req.params.id);
    
    if (!house) return res.status(404).json({ error: "House not found!" });
    if (house.status !== 'available') return res.status(400).json({ error: "Sorry, this house is already taken!" });

    // 2. Update the house with the Customer's ID and change status
    house.currentTenant = req.user.id; 
    house.status = 'rented';
    
    // 3. Save the updated house back to the database
    await house.save(); 
    
    res.json({ message: "Congratulations! You rented the house!", house });
 } catch (error) {
    console.log("CRASH REASON:", error); // <-- This prints the exact problem in your terminal!
    res.status(500).json({ error: "Server error" });
  }
};
// Add this right above module.exports
const uploadHouseImage = async (req, res) => {
  try {
    // 1. The Porter (Multer) already caught the file and put it in req.file!
    if (!req.file) return res.status(400).json({ error: "No image provided!" });

    // 2. Find the house we want to add the image to
    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    // 3. Create the image object using the Porter's sticky note (req.file)
    const newImage = {
      url: `/uploads/${req.file.filename}`, // The link to view the image
      mimeType: req.file.mimetype,          // e.g., 'image/jpeg'
      size: req.file.size                   // Size in bytes
    };

    // 4. Push it into the house's images array and save!
    house.images.push(newImage);
    await house.save();

    res.json({ message: "Image uploaded successfully!", house });
  } catch (error) {
    console.log("CRASH REASON:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
};

// --- UPDATE A HOUSE ---
const updateProperty = async (req, res) => {
  try {
    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    // SECURITY CHECK: Is the person trying to update it the actual owner?
    if (house.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Bouncer says: You can't edit someone else's house!" });
    }

    const updatedHouse = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "House updated!", house: updatedHouse });
  } catch (error) {
    res.status(500).json({ error: "Server error during update" });
  }
};

// --- DELETE A HOUSE ---
const deleteProperty = async (req, res) => {
  try {
    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    // SECURITY CHECK: Only the owner can delete it!
    if (house.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Bouncer says: You can't delete someone else's house!" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "House deleted permanently from the Kitchen." });
  } catch (error) {
    res.status(500).json({ error: "Server error during deletion" });
  }
};

// Don't forget to add it to the exports at the very bottom!
module.exports = { createProperty, getAllProperties, rentProperty, uploadHouseImage, deleteProperty, updateProperty };
