
const Product = require("../models/Product.model");

const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      description,
    });

    return res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


const updateProdcut=async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product updated", product: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports ={createProduct,updateProdcut};    