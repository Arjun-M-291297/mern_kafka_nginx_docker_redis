import express from "express";
import { getAllUsers, signUp, loginUser } from "./controller.js";
import verifyToken from "./middlewares/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  getAllUsers(req, res);
});

router.post("/signup", (req, res) => {
  signUp(req, res);
});

router.post("/login", (req, res) => {
  loginUser(req, res);
});
export default router;
