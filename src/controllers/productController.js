import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { businessId: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      businessId: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateStock = asyncHandler(async (req, res) => {
  try {
    const { operation, quantity } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (operation === "increase") {
      product.stock += quantity;
    } else if (operation === "decrease") {
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      product.stock -= quantity;
    } else {
      return res.status(400).json({ message: "Invalid operation" });
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
