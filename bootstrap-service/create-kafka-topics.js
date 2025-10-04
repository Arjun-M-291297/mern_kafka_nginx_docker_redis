const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "admin-client",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

const topicsToCreate = ["user-events", "order-events", "wallet-events", "product-events"];

async function createTopics() {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: topicsToCreate.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
    console.log("✅ Topics created successfully!");
  } catch (err) {
    console.error("❌ Error creating topics:", err);
  } finally {
    await admin.disconnect();
  }
}

createTopics();
