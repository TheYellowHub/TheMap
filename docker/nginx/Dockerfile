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

# Handle permissions to django media root
RUN mkdir -p /app/media
# TODO: change nobody to the specific user used during post/patch requests
RUN chown -R nobody:nobody /app/media 

# Copy react static files and start nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
