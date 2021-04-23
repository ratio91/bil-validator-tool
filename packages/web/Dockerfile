# multi-stage build

# first, build the project
FROM node:14.15-alpine AS build

WORKDIR /app

# build only from root project!
COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY yarn.lock .
RUN apk --no-cache --virtual build-dependencies add --update python3 make g++ \
    && yarn
COPY packages/web/package.json /app/packages/web/package.json
WORKDIR /app/packages/web
RUN yarn
COPY packages/web /app/packages/web
RUN yarn build:docker


# second, deploy the application
FROM nginx:stable-alpine

RUN apk update && apk add bash
COPY --from=build /app/packages/web/dist /var/www
COPY packages/web/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY packages/web/docker-deployment/start_up.sh /bin/start_up.sh
RUN chmod +x /bin/start_up.sh

# default behaviour: proxy backend through a /validator-api subpath of the current serving domain or location
ENV BACKEND_URL=/validator-api

# default behaviour: resolve docker-container or service named validator-api in the current docker-network
# this variable is a url that specifies where requests to BACKEND_URL should be routed to
ENV BACKEND_PROXY_URL=http://validator-api:8083

# default behaviour: no base-path given; page is served from root http://domain/ when BASE_PATH is '/'
# if the validator is served from a subpath, this variable has to be set with a starting '/', but should not end with '/'
ENV BASE_PATH=/

EXPOSE 8082

ENTRYPOINT '/bin/start_up.sh'
