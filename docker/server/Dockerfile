# syntax=docker/dockerfile:1

# Build - react static files
FROM node:20-alpine as frontend

ARG DOPPLER_PROJECT
ARG DOPPLER_CONFIG
ARG DOPPLER_TOKEN
ARG DOPPLER_FILE=doppler.env

WORKDIR /app/frontend
## Install Doppler
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub \
    && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories \
    && apk add doppler
# Install dependencies
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps --fetch-timeout=600000
# Build app
COPY ./frontend/ ./docker/server/*.env ./  
RUN if [[ -z "$DOPPLER_TOKEN" ]]; \
    then echo "DOPPLER_TOKEN argument wasn't provided - going to use the local $DOPPLER_FILE file" && export $(cat $DOPPLER_FILE | xargs); \
    else echo "DOPPLER_TOKEN argument was provided - going to ignore the local $DOPPLER_FILE file and use the existing enviroment variables (DOPPLER_PROJECT=$DOPPLER_PROJECT, DOPPLER_CONFIG=$DOPPLER_CONFIG)"; \
    fi && \ 
    doppler run --project $DOPPLER_PROJECT --config $DOPPLER_CONFIG --token $DOPPLER_TOKEN -- npm run build

# Deploy Django + the above
FROM python:3.11.5 as backend
RUN apt-get update -y
RUN apt-get install vim -y
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app/backend
# Copy backend filed
COPY ./backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./backend/ ./
RUN rm -rf */__pycache__
RUN rm -rf db.sqlite3
# Copy frontend files
COPY --from=frontend /app/frontend/build /app/frontend/build
RUN mkdir /app/frontend/build/root
RUN for file in $(ls /app/frontend/build | grep -E -v '^(index\.html|static|root)$'); do mv "/app/frontend/build/$file" /app/frontend/build/root; done
# Copy deployment related scripts
COPY ./docker/server/server-entrypoint.sh /app/
RUN chmod +x /app/*.sh

# Start the server
CMD ["sh", "/app/server-entrypoint.sh"]