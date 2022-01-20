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
RUN yarn install --frozen-lockfile --production=true

# Update the system
#RUN apk --no-cache -U upgrade

# Copy js files and change ownership to user node. we copy only content from src/ folder as test/ folder is not necessary
COPY --chown=node:node --from=server /server/build /home/node/server
COPY --chown=node:node --from=client /client/build ./public

# this directory seems different when building on windows compared to unix
# when on windows it should be ./server/server.js
CMD ["node", "./server/src/server.js"]