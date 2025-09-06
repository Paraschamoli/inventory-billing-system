import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTransactions = asyncHandler(async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    let query = { businessId: req.user._id };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate("customerId", "name")
      .populate("vendorId", "name")
      .populate("products.productId", "name");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    })
      .populate("customerId", "name phone email address")
      .populate("vendorId", "name phone email address")
      .populate("products.productId", "name description price");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createTransaction = asyncHandler(async (req, res) => {
  try {
    const { type, customerId, vendorId, products, date } = req.body;

    let totalAmount = 0;
    for (const item of products) {
      totalAmount += item.price * item.quantity;
    }

    const transaction = new Transaction({
      type,
      customerId: type === "sale" ? customerId : null,
      vendorId: type === "purchase" ? vendorId : null,
      products,
      totalAmount,
      date: date || Date.now(),
      businessId: req.user._id,
    });

    for (const item of products) {
      const product = await Product.findOne({
        _id: item.productId,
        businessId: req.user._id,
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }

      if (type === "purchase") {
        product.stock += item.quantity;
      } else if (type === "sale") {
        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for ${product.name}` });
        }
        product.stock -= item.quantity;
      }

      await product.save();
    }

    const createdTransaction = await transaction.save();
    const populatedTransaction = await Transaction.findById(
      createdTransaction._id
    )
      .populate("customerId", "name")
      .populate("vendorId", "name")
      .populate("products.productId", "name");

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export { getTransactions, getTransaction, createTransaction };
