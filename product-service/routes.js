import express from "express";
import { getAllProducts, getProduct, addProduct } from "./controller.js";
const router = express.Router();

router.get("/", (req, res) => {
  getAllProducts(req, res);
});

router.get("/:id", (req, res) => {
  getProduct(req, res);
});

router.post("/", (req, res) => {
  addProduct(req, res);
});

export default router;
