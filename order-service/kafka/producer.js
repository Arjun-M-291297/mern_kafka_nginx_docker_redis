import kafka from "./client.js";

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

export const sendEvent = async (topic, key, value) => {
  try {
    await producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
    console.log(`📤 Event sent to ${topic}:`, value);
  } catch (error) {
    console.error("❌ Failed to send Kafka event:", error);
  }
};