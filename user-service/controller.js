import UserModel from "./models/user.js";
import { sendEvent } from "./kafka/producer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function signUp(req, res) {
  try {
    let { name, email, password } = req.body;
    password = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({ name, email, password });
    const user = await newUser.save();
    await sendEvent("user-events", user._id.toString(), {
      type: "user.created",
      data: { userId: user._id, email: user.email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      let passWordMatch = bcrypt.compareSync(password, user.password);
      if (!passWordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successful", userId: user._id, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
export { getAllUsers, signUp, loginUser };
