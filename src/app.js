import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


// Load environment variables
dotenv.config({
  path: "./.env",
});

// Import routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import contactRoutes from "./routes/contacts.js";
import transactionRoutes from "./routes/transactions.js";
import reportRoutes from "./routes/reports.js";

// Import middleware
import errorHandler from "./middleware/errorHandler.js";

import connectDB from "./config/database.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
