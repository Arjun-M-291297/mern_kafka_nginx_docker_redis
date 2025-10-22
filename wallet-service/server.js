import express from "express";
import routes from "./routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createConsumer } from "./kafka/consumer.js";
import { connectProducer } from "./kafka/producer.js";
import { createWallet, debitToWallet } from "./controller.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/wallet", routes);
const handleUserEvent = async (event) => {
  if (event.type === "user.created") {
    await createWallet(event.data);
    console.log(`💰 Wallet created for ${event.data.email}`);
  }
};
const handleOrderEvent = async (event) => {
  if (event.type === "order.created") {
    await debitToWallet({ userId: event.data.userId, balance: event.data.totalPrice });
    console.log(`💰 Wallet created for ${event.data.email}`);
  }
};
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected");

    app.listen(3003, "0.0.0.0", async () => {
      await connectProducer();
      await createConsumer("wallet-service-group", "user-events", handleUserEvent);
      await createConsumer("wallet-service-group-order", "order-events", handleOrderEvent);
      console.log("🚀 Wallet service running on port 3002");
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
