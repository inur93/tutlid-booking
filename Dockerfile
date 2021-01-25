FROM node:14.9.0-alpine as client

WORKDIR /client

COPY ./client/package.json ./
COPY ./client/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./client .

RUN yarn build

FROM node:14.9.0-alpine as server

WORKDIR /server

COPY ./server/package.json ./
COPY ./server/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./server .

RUN yarn run build

FROM node:14.9.0-alpine as production

RUN mkdir -p /home/node && chown -R node:node /home/node

# Set CWD
WORKDIR /home/node

# Copy package.json and package-lock.json
COPY ./server/package.json ./
COPY ./server/yarn.lock ./

# Switch to user node
USER node

# Install libraries as user node. If NODE_ENV=production dev_dependencies will not be installed.
RUN yarn install --frozen-lockfile

# Update the system
#RUN apk --no-cache -U upgrade

# Copy js files and change ownership to user node
COPY --chown=node:node --from=server /server/build ./server

COPY --chown=node:node --from=client /client/build ./public


CMD ["node", "./server/server.js"]