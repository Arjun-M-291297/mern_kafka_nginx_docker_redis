import kafka from "./client.js";

export const createConsumer = async (groupId, topic, onMessage) => {
  const consumer = kafka.consumer({ groupId });

  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });
      console.log(`✅ Kafka Consumer subscribed to ${topic} in group ${groupId}`);

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const key = message.key?.toString();
          const value = JSON.parse(message.value.toString());

          console.log(`📥 Event received from ${topic}:`, value);
          await onMessage(value, key, partition);
        },
      });

      break; // success
    } catch (err) {
      attempt++;
      console.log(`⚠️ Consumer connection attempt ${attempt} failed: ${err.message}`);
      // Wait 5 seconds before retry
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};
