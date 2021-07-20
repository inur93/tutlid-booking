FROM node:14.9.0

WORKDIR /server

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile 
#--production=false

COPY . .

CMD ["yarn", "run", "test:debug"]