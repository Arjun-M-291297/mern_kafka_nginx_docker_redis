# Use Node 20
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3004

CMD ["node", "server.js"]
