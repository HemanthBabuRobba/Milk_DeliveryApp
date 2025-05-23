const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  userDetails: {
    username: String,
    email: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
cartSchema.index({ user: 1 });

// Calculate total amount before saving
cartSchema.pre('save', async function(next) {
  try {
    // Populate product details to get prices
    await this.populate('items.product', 'price');
    
    // Calculate total amount
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // If user details are not set, fetch them
    if (!this.userDetails) {
      const User = mongoose.model('User');
      const user = await User.findById(this.user).select('username email');
      if (user) {
        this.userDetails = {
          username: user.username,
          email: user.email
        };
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Cart', cartSchema);