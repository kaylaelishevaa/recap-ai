# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

# API base URL is baked at build time. Railway/Render pass the service variable
# as a build arg; locally (docker-compose) it falls back to localhost in api.js.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve with nginx, listening on $PORT (Railway/Render assign it).
# nginx:alpine's entrypoint runs envsubst on /etc/nginx/templates/*.template.
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
