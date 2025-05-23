require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: "Fresh Cow Milk",
    description: "Pure and fresh cow milk, collected daily from local farms",
    price: 60,
    unit: "L",
    stock: 100,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Buffalo Milk",
    description: "Rich and creamy buffalo milk, perfect for making curd and sweets",
    price: 80,
    unit: "L",
    stock: 50,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Skimmed Milk",
    description: "Low-fat milk, ideal for health-conscious individuals",
    price: 55,
    unit: "L",
    stock: 75,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Full Cream Milk",
    description: "Rich and creamy milk with full fat content",
    price: 70,
    unit: "L",
    stock: 60,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Organic Milk",
    description: "Certified organic milk from grass-fed cows",
    price: 90,
    unit: "L",
    stock: 40,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Flavored Milk - Chocolate",
    description: "Delicious chocolate-flavored milk",
    price: 65,
    unit: "L",
    stock: 30,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Flavored Milk - Strawberry",
    description: "Sweet and refreshing strawberry-flavored milk",
    price: 65,
    unit: "L",
    stock: 30,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Curd",
    description: "Fresh and creamy curd made from pure milk",
    price: 40,
    unit: "kg",
    stock: 50,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

async function addSampleProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add sample products
    const products = await Product.insertMany(sampleProducts);
    console.log('Added sample products:', products.length);

    console.log('Sample products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample products:', error);
    process.exit(1);
  }
}

addSampleProducts(); 