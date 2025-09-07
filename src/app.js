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
import bodyParser from "body-parser";

const app = express();


app.use((req, res, next) => {
  console.log('\n=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  
  // Store the original send method
  const originalSend = res.send;
  
  // Capture the request body
  let requestBody = '';
  req.on('data', (chunk) => {
    requestBody += chunk.toString();
  });
  
  req.on('end', () => {
    console.log('Raw request body:', requestBody);
    try {
      const parsedBody = JSON.parse(requestBody);
      console.log('Parsed body:', parsedBody);
      req.body = parsedBody; // Manually set the body
    } catch (e) {
      console.log('Failed to parse body as JSON');
      req.body = {};
    }
    next();
  });
});

app.use(express.json({ limit: "16kb" }));  
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);


app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });