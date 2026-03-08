const Product = require("../models/Product");

// GET all products
const getProducts = async (req, res) => {
  try {
    const { search, brand, colour, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } },
        { collectionName: { $regex: search, $options: "i" } },
        { material: { $regex: search, $options: "i" } },
        { colour: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
      ];
    }
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (colour) filter.colour = { $regex: colour, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });
  }
};

// PUT update product specs + offer
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
