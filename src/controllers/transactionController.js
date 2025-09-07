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
      console.log('=== TRANSACTION CREATE REQUEST ===');
    console.log('Request body received:', JSON.stringify(req.body, null, 2));
    console.log('Products value:', req.body.products);
    console.log('Products type:', typeof req.body.products);
    console.log('Is products array:', Array.isArray(req.body.products));
    console.log('User making request:', req.user._id);
    const { type, customerId, vendorId, products, date } = req.body;

    // ===== ADD VALIDATION HERE =====
    // Check if products exists and is an array
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ 
        message: 'Products must be provided as an array' 
      });
    }

    // Check if products array is empty
    if (products.length === 0) {
      return res.status(400).json({ 
        message: 'Products array cannot be empty' 
      });
    }

    // Validate required fields based on transaction type
    if (type === 'sale' && !customerId) {
      return res.status(400).json({ 
        message: 'customerId is required for sales' 
      });
    }

    if (type === 'purchase' && !vendorId) {
      return res.status(400).json({ 
        message: 'vendorId is required for purchases' 
      });
    }

    // Validate each product item
    for (const item of products) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ 
          message: 'Each product must have productId, quantity, and price' 
        });
      }

      if (item.quantity < 1) {
        return res.status(400).json({ 
          message: 'Quantity must be at least 1' 
        });
      }

      if (item.price < 0) {
        return res.status(400).json({ 
          message: 'Price cannot be negative' 
        });
      }
    }
    // ===== END OF VALIDATION =====

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
            .json({ 
              message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
            });
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
