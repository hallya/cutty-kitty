FROM node:10.16.3-alpine

RUN mkdir -p /app/client
WORKDIR /app/client

COPY package.json /app/client
COPY package-lock.json /app/client

RUN npm install

COPY . /app/client

EXPOSE 3000

CMD ["npm", "start"]