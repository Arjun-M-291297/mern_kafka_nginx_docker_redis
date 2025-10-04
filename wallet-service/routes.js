import express from "express";
import { getWallet, creditToWallet, debitToWallet } from "./controller.js";
const router = express.Router();

router.get("/:userId", (req, res) => {
  getWallet(req, res);
});

router.post("/credit", (req, res) => {
  creditToWallet(req, res);
});

router.post("/debit", (req, res) => {
  debitToWallet(req, res);
});

export default router;
