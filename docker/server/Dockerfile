# syntax=docker/dockerfile:1

# Build - react static files
FROM node:20-alpine as frontend
ARG ENVKEY
ARG ENVKEY_FILE=envkey.env
WORKDIR /app/frontend
# Install EnvKeySource
ARG ENVKEYSOURCE_INSTALLATION=envkey-source_2.4.3_linux_amd64.tar.gz
COPY ./envkey-source/$ENVKEYSOURCE_INSTALLATION ./
RUN tar zxf $ENVKEYSOURCE_INSTALLATION 1> /dev/null
RUN mv envkey-source /usr/local/bin/
# Install dependencies
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps --fetch-timeout=600000
# Build app
COPY ./frontend/ ./docker/server/*.env ./  
RUN if [[ -z "$ENVKEY" ]]; \
    then echo "ENVKEY argument wasn't provided - going to use the local $ENVKEY_FILE file"; \
    else echo "ENVKEY argument was provided - going to ignore the local $ENVKEY_FILE file" && echo "ENVKEY=$ENVKRY" > $ENVKEY_FILE && cat $ENVKEY_FILE; \
    fi
RUN envkey-source --env-file $ENVKEY_FILE -- npm run build

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