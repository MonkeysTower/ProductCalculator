# Stage 1 - React build
FROM node:18-alpine AS react_build

WORKDIR /app

COPY react/package*.json ./
RUN npm install
COPY react/ ./
COPY .env .env
RUN npm run build

# Stage 2 - nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/

COPY --from=react_build /app/build /usr/share/nginx/html
