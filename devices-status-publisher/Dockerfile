FROM node

WORKDIR /app/devices-status-publisher

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8004

CMD ["npm", "start"]