import express from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update/:itemId", updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

export default router;
