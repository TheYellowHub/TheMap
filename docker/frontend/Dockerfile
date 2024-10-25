## Build - react static files
FROM node:20-alpine as build
WORKDIR /app/frontend

## Install Doppler
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub \
    && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories \
    && apk add doppler

## Install dependencies
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps --fetch-timeout=600000 

## Build app
COPY ./frontend/ ./
COPY ./docker/backend/doppler.env ./
RUN export $(cat doppler.env | xargs) && echo --project $DOPPLER_PROJECT --config $DOPPLER_CONFIG --token $DOPPLER_TOKEN && doppler run --project $DOPPLER_PROJECT --config $DOPPLER_CONFIG --token $DOPPLER_TOKEN -- npm run build

## Deploy - using Nginx 
FROM nginx:stable-alpine
COPY ./docker/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
# Copy react static files and start nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
# CMD ["nginx-debug", "-g", "daemon off; error_log /dev/stdout debug;"]