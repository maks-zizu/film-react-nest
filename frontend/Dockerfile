FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}

RUN npm run build

FROM alpine:3.20
WORKDIR /app

COPY --from=build /app/dist ./dist
VOLUME ["/frontend-dist"]

CMD ["sh", "-c", "mkdir -p /frontend-dist && rm -rf /frontend-dist/* && cp -R ./dist/. /frontend-dist/ && echo \"Frontend dist copied to /frontend-dist\" && tail -f /dev/null"]
