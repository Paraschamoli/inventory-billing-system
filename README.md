# 📦 Inventory & Billing Management System API

## 📖 Overview
A RESTful API for small businesses to manage **products, customers, vendors, and transactions**.  
Built with **Node.js, Express, and MongoDB**.

---

## ✨ Features
- User Authentication with JWT  
- Product Management with Stock Tracking  
- Customer & Vendor Management  
- Sales & Purchase Transactions  
- Inventory and Transaction Reports  

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT (JSON Web Tokens)  
- **Password Hashing:** bcryptjs  

---
# Inventory & Billing Management System

A complete backend system for small businesses to manage products, customers, vendors, and transactions with authentication and reporting features.

## 🚀 Live Deployment

The API is now live and available at:  
**https://inventory-billing-system-yc3i.onrender.com**

### Base URL
**https://inventory-billing-system-yc3i.onrender.com/api**


## ⚙️ Installation

### 📌 Prerequisites
- Node.js (v14 or higher)  
- MongoDB (local or Atlas)  
- npm or yarn  

### 🔧 Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/Paraschamoli/inventory-billing-system.git
   cd inventory-billing-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in root directory
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

---

## 🚀 API Endpoints

### 🔐 Authentication
#### 1. Register a New User
- **URL:** `/auth/register`  
- **Method:** `POST`  
- **Access:** Public  

**Request Body**
```json
{
  "businessName": "My Business",
  "email": "business@example.com",
  "password": "password123"
}
```

**Success (201)**
```json
{
  "_id": "5f8d0d55b54764421b6b1a5d",
  "businessName": "My Business",
  "email": "business@example.com",
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error (400)**
```json
{ "message": "User already exists" }
```

#### 2. Login User
- **URL:** `/auth/login`  
- **Method:** `POST`  
- **Access:** Public  

**Request Body**
```json
{
  "email": "business@example.com",
  "password": "password123"
}
```

**Success (200)**
```json
{
  "_id": "5f8d0d55b54764421b6b1a5d",
  "businessName": "My Business",
  "email": "business@example.com",
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error (401)**
```json
{ "message": "Invalid email or password" }
```

#### 3. Get User Profile
- **URL:** `/auth/profile`  
- **Method:** `GET`  
- **Access:** Private  

**Success (200)**
```json
{
  "_id": "5f8d0d55b54764421b6b1a5d",
  "businessName": "My Business",
  "email": "business@example.com"
}
```

**Error (401)**
```json
{ "message": "Not authorized, no token" }
```

---

### 📦 Product Endpoints
- `GET /products` → Get all products (search & filter supported)  
- `POST /products` → Create new product  
- `GET /products/:id` → Get single product  
- `PUT /products/:id` → Update product  
- `DELETE /products/:id` → Delete product  
- `PATCH /products/:id/stock` → Update product stock  

---

### 👥 Contact Endpoints (Customers/Vendors)
- `GET /contacts` → Get all contacts (filter by type or search)  
- `POST /contacts` → Create contact  
- `GET /contacts/:id` → Get single contact  
- `PUT /contacts/:id` → Update contact  
- `DELETE /contacts/:id` → Delete contact  

---

### 💰 Transaction Endpoints
- `GET /transactions` → Get all transactions (filter by type/date)  
- `POST /transactions` → Create transaction (sale or purchase)  
- `GET /transactions/:id` → Get single transaction  

---

### 📊 Report Endpoints
- `GET /reports/inventory` → Inventory report  
- `GET /reports/transactions` → Transactions report  
- `GET /reports/contacts/:id/transactions` → Contact transaction history  

---

## ⚠️ Error Responses
- **400 Bad Request**
```json
{ "message": "Validation error message" }
```

- **401 Unauthorized**
```json
{ "message": "Not authorized, no token" }
```

- **404 Not Found**
```json
{ "message": "Resource not found" }
```

- **500 Internal Server Error**
```json
{ "message": "Server error description" }
```

## 🚀 API Testing with Postman

A complete Postman collection is included for testing all API endpoints.

### 📋 Postman Collection
The collection file is located at: `Inventory-Billing-System.postman_collection.json`

### 🔧 Import Instructions
1. Open Postman
2. Click **Import** → **Upload Files**
3. Select the `Inventory-Billing-System.postman_collection.json` file
4. Click **Import**

### 🛠 Setup for Testing
1. **Set Environment Variables:**
   - Create a new environment in Postman
   - Add variable: `baseUrl` = `https://inventory-billing-system-yc3i.onrender.com/api`

2. **Authentication Flow:**
   - Start with **Register User** to create an account
   - Use **Login User** to get JWT token
   - Token is automatically stored for authenticated requests

### 📚 Collection Includes
- ✅ Authentication endpoints (Register, Login, Profile)
- ✅ Complete CRUD operations for Products
- ✅ Customer/Vendor management endpoints  
- ✅ Transaction creation and management
- ✅ Inventory and sales reports
- ✅ Pre-configured request examples

### ⚡ Testing Tips
- All private endpoints require authentication
- Start with product/contact creation before transactions
- Check stock levels before creating sales transactions
- Use reports to verify data consistency



📌 **Tip:** Always start with **Register/Login** to obtain a JWT token before testing private endpoints.