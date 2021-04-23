# multi-stage build

# first, build the project
FROM node:14.15-alpine AS build

WORKDIR /app

# copy needed config-files
COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY packages/api/package.json /app/packages/api/package.json
RUN apk --no-cache --virtual build-dependencies add --update python3 make g++ \
    && yarn
WORKDIR /app/packages/api
RUN yarn add -D ansi-regex
COPY packages/api /app/packages/api
RUN yarn build:prod


# second, deploy the application
FROM node:14.15-alpine

WORKDIR /app
COPY --from=build /app/packages/api/dist/ /app/
COPY --from=build /app/packages/api/package.json /app/package.json
COPY --from=build /app/packages/api/node_modules/ /app/node_modules/
COPY --from=build /app/node_modules/ /app/node_modules/
COPY packages/api/restConfiguration.json /app/restConfiguration.json

# default behaviour: serve swagger api-specs from /swagger
ENV SWAGGER_PATH=/swagger
ENV LOGDIR_PATH=/app/logs/

EXPOSE 8083

CMD ["node","main.js"]
