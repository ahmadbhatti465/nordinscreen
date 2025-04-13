FROM node

WORKDIR /app/widget

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8007

CMD ["npm", "start"]