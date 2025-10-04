import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "product-service",
  // brokers: ["kafka:27017"],
  brokers: ["localhost:9092"],
});
export default kafka;
