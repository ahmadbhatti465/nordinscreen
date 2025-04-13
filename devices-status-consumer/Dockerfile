FROM node

WORKDIR /app/devices-status-consumer

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8005

CMD ["npm", "start"]