FROM node:16.15 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY ng2-application.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/pulse-scenes /usr/share/nginx/html
