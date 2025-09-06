import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Contact from '../models/Contact.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const getInventoryReport =asyncHandler( async (req, res) => {
  try {
    const products = await Product.find({ businessId: req.user._id });
    
    const lowStockProducts = products.filter(product => product.stock < 10);
    const outOfStockProducts = products.filter(product => product.stock === 0);
    
    res.json({
      totalProducts: products.length,
      totalStockValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getTransactionsReport =asyncHandler( async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
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
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .populate('products.productId', 'name')
      .sort({ date: -1 });

    const totalSales = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    const totalPurchases = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    const netProfit = totalSales - totalPurchases;

    res.json({
      totalTransactions: transactions.length,
      totalSales,
      totalPurchases,
      netProfit,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getContactTransactionHistory =asyncHandler( async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findOne({
      _id: id,
      businessId: req.user._id
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    let query = { businessId: req.user._id };
    
    if (contact.type === 'customer') {
      query.customerId = id;
      query.type = 'sale';
    } else {
      query.vendorId = id;
      query.type = 'purchase';
    }
    
    const transactions = await Transaction.find(query)
      .populate('products.productId', 'name')
      .sort({ date: -1 });
    
    const totalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
    res.json({
      contact,
      totalTransactions: transactions.length,
      totalAmount,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export {
  getInventoryReport,
  getTransactionsReport,
  getContactTransactionHistory
};