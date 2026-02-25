FROM node:21-alpine3.20

COPY . /app

WORKDIR /app

RUN npm install

ENTRYPOINT ["npm", "start" ]