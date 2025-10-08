#!/bin/sh

# Default broker address
KAFKA_BROKER=${KAFKA_BROKERS:-kafka:29092}

echo "⏳ Waiting for Kafka at $KAFKA_BROKER ..."

while ! nc -z $(echo $KAFKA_BROKER | cut -d':' -f1) $(echo $KAFKA_BROKER | cut -d':' -f2); do
  echo "Kafka is unavailable, sleeping 3 seconds..."
  sleep 3
done

echo "✅ Kafka is available, starting service..."

# Start your service (update port if needed)
node server.js
