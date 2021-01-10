FROM node:14.9.0-alpine

WORKDIR /server

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 8000
EXPOSE 9229

CMD ["yarn", "run", "start:debug"]