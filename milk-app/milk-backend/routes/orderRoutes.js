import express from "express";
import { createOrder, getUserOrders, getOrderDetails, cancelOrder } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();


router.post("/", authenticateToken, createOrder);


router.get("/", authenticateToken, getUserOrders);


router.get("/:orderId", authenticateToken, getOrderDetails);

router.put("/:orderId/cancel", authenticateToken, cancelOrder);

export default router;
