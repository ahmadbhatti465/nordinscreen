FROM node:16.20.2

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build