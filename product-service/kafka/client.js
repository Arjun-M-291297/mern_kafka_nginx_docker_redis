import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();
const kafka = new Kafka({
  clientId: "product-service",
  brokers: [process.env.KAFKA_BROKERS || "kafka:29092"],
  retry: { initialRetryTime: 3000, retries: 10 },
});
export default kafka;
