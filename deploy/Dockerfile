FROM node:latest AS builder

COPY . /app
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com;npm install;npm run build;ls -l /app

FROM nginx:1.31.1-alpine
COPY --from=builder /app/dist /app/dist
COPY deploy/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

CMD ["nginx", "-g", "daemon off;"]

