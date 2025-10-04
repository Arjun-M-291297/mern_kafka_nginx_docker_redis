import { sendEvent } from "./kafka/producer.js";
import OrderModel from "./models/order.js";
import axios from "axios";
async function getOrderInfo(req, res) {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.find({ _id: orderId });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createOrder(req, res) {
  try {
    const { userId, productId, quantity } = req.body;
    let productDetail = await axios.get(`http://localhost:3001/api/products/${productId}`);
    if (!productDetail.data || productDetail.data.length === 0) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (productDetail.data[0].quantity < quantity) {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }
    const totalPrice = productDetail.data[0].price * quantity;
    const newOrder = new OrderModel({ userId, productId, quantity, totalPrice, status: "Pending" });
    await newOrder.save();
    await sendEvent("order-events", userId.toString(), {
      type: "order.created",
      data: newOrder.toObject(),
    });
    await sendEvent("product-events", userId.toString(), {
      type: "product.ordered",
      data: newOrder.toObject(),
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: orderId,
      },
      { status: "Cancelled" },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
export { getOrderInfo, createOrder, cancelOrder };
