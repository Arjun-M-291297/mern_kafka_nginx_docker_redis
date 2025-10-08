import express from "express";
import routes from "./routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectProducer } from "./kafka/producer.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", routes);
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected");

    app.listen(3000,'0.0.0.0', async () => {
      await connectProducer();
      console.log("🚀 User service running on port 3000");
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
