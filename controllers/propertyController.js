const Property = require("../models/Property");

const createProperty = async (req, res) => {
  try {
    const houseData = { ...req.body, owner: req.user.id };
    const newHouse = await Property.create(houseData);
    res.status(201).json({ message: "House saved SECURELY!", house: newHouse });
  } catch (error) {
    res.status(400).json({ error: "Kitchen Manager rejected it." });
  }
};

const getAllProperties = async (req, res) => {
  const allHouses = await Property.find();
  res.json(allHouses);
};

const rentProperty = async (req, res) => {
  try {
    const house = await Property.findById(req.params.id);

    if (!house) return res.status(404).json({ error: "House not found!" });
    if (house.status !== "available")
      return res
        .status(400)
        .json({ error: "Sorry, this house is already taken!" });

    house.currentTenant = req.user.id;
    house.status = "rented";

    await house.save();

    res.json({ message: "Congratulations! You rented the house!", house });
  } catch (error) {
    console.log("CRASH REASON:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const uploadHouseImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided!" });

    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    const newImage = {
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    house.images.push(newImage);
    await house.save();

    res.json({ message: "Image uploaded successfully!", house });
  } catch (error) {
    console.log("CRASH REASON:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
};

const updateProperty = async (req, res) => {
  try {
    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    if (house.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Bouncer says: You can't edit someone else's house!" });
    }

    const updatedHouse = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ message: "House updated!", house: updatedHouse });
  } catch (error) {
    res.status(500).json({ error: "Server error during update" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const house = await Property.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    if (house.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          error: "Bouncer says: You can't delete someone else's house!",
        });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "House deleted permanently from the Kitchen." });
  } catch (error) {
    res.status(500).json({ error: "Server error during deletion" });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  rentProperty,
  uploadHouseImage,
  deleteProperty,
  updateProperty,
};
