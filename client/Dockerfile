FROM node:14.9.0-alpine

WORKDIR /client

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]