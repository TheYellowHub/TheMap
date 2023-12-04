# syntax=docker/dockerfile:1

# Build frontend - react static files
FROM node:20-alpine as frontend
WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY ./frontend/ ./
RUN npm run build

# Deploy Django + the above
FROM python:3.11.5 as backend
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
# Copy deploy related scripts
COPY ./docker/server/server-entrypoint.sh /app/
COPY ./docker/env /app/env
RUN chmod +x /app/*.sh

# Start the server
CMD ["sh", "/app/server-entrypoint.sh"]