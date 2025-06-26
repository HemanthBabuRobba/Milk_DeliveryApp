import express from "express";
import {
  login,
  addProduct,
  editProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", login);
router.post("/products", addProduct);
router.put("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/users", getAllUsers);

export default router;
