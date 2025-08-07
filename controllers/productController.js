const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { name, description, price, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      stock,
      createdBy: req.user.id, 
    });

    await product.save();

    console.log("Product created:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
