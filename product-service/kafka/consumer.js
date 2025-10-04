import kafka from "./client.js";

export const createConsumer = async (groupId, topic, onMessage) => {
  const consumer = kafka.consumer({ groupId });

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
};