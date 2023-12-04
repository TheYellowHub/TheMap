# Build frontend - react static files
FROM node:20-alpine as build
WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY ./frontend/ ./
RUN npm run build

# Nginx 
FROM nginx:stable-alpine
COPY ./docker/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy react static files and start nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
# CMD ["nginx-debug", "-g", "daemon off; error_log /dev/stdout debug;"] # TODO: according to variable