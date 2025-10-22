# Use Node 20
FROM node:20

# Install netcat-openbsd for wait-for-kafka.sh
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

# Use wait-for-kafka before starting
COPY wait-for-kafka.sh /wait-for-kafka.sh
RUN chmod +x /wait-for-kafka.sh

CMD ["/wait-for-kafka.sh"]
