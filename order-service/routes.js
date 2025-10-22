import express from "express";
import { getOrderInfo, createOrder, cancelOrder } from "./controller.js";
const router = express.Router();

router.get("/:orderId", (req, res) => {
  getOrderInfo(req, res);
});

router.post("/", (req, res) => {
  createOrder(req, res);
});

router.delete("/:orderId", (req, res) => {
  cancelOrder(req, res);
});

export default router;
