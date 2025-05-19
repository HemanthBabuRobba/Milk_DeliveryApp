require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createUser = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if user already exists
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create new user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    await user.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createUser(); 