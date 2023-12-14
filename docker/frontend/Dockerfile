## Build - react static files
FROM node:20-alpine as build
WORKDIR /app/frontend
## Install EnvKeySource
## from the web
# RUN apk --no-cache add curl
# RUN VERSION=$(curl https://envkey-releases.s3.amazonaws.com/latest/envkeysource-version.txt) \ 
# && curl -s https://envkey-releases.s3.amazonaws.com/envkeysource/release_artifacts/$VERSION/install.sh | bash
## or offline
ARG ENVKEYSOURCE_INSTALLATION=envkey-source_2.4.3_linux_amd64.tar.gz
COPY ./envkey-source/$ENVKEYSOURCE_INSTALLATION ./
RUN tar zxf $ENVKEYSOURCE_INSTALLATION 1> /dev/null
RUN mv envkey-source /usr/local/bin/
## Install dependencies
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps --fetch-timeout=600000 
## Build app
COPY ./frontend/ ./
COPY ./docker/backend/envkey.env ./
RUN envkey-source --env-file envkey.env -- npm run build

## Deploy - using Nginx 
FROM nginx:stable-alpine
COPY ./docker/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
# Copy react static files and start nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
# CMD ["nginx-debug", "-g", "daemon off; error_log /dev/stdout debug;"]