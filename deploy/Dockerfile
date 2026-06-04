FROM node:latest AS builder

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build;ls -l /app

FROM nginx:stable-alpine3.23-perl

COPY --from=builder /app/dist /app/dist
COPY deploy/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

