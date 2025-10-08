import express from "express";
import routes from "./routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createConsumer } from "./kafka/consumer.js";
import { connectProducer } from "./kafka/producer.js";
import { updatePdtQuantity } from "./controller.js";

const handleOrderEvent = async (event) => {
  if (event.type === "product.ordered") {
    await updatePdtQuantity(event.data);
    console.log(`💰 Product quantity updated for ${event.data.productId}`);
  }
};

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routes);
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected");

    app.listen(3001,'0.0.0.0', async () => {
      await connectProducer();
      await createConsumer("product-service-group", "product-events", handleOrderEvent);
      console.log("🚀 Product service running on port 3001");
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
