require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Successfully connected to MongoDB!");

    // Test User model
    const User = require("../models/User");
    const users = await User.find().limit(1);
    console.log("Users in database:", users.length);

    // Test Product model
    const Product = require("../models/Product");
    const products = await Product.find().limit(1);
    console.log("Products in database:", products.length);

    // Test Cart model
    const Cart = require("../models/Cart");
    const carts = await Cart.find().limit(1);
    console.log("Carts in database:", carts.length);

    process.exit(0);
  } catch (error) {
    console.error("Database connection test failed:", error);
    process.exit(1);
  }
}

testConnection();
