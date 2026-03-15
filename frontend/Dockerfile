FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN npm install -g npm@11.11.1

COPY package*.json ./
RUN npm ci --no-audit --no-fund \
  && npm install --no-save @rollup/rollup-linux-x64-gnu@$(node -p "require('./package-lock.json').packages['node_modules/rollup'].version")

COPY . .

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ARG VITE_BASE_PATH=/
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN npm run build

FROM alpine:3.20
WORKDIR /app

COPY --from=build /app/dist ./dist
VOLUME ["/frontend-dist"]

CMD ["sh", "-c", "mkdir -p /frontend-dist && rm -rf /frontend-dist/* && cp -R ./dist/. /frontend-dist/ && echo \"Frontend dist copied to /frontend-dist\" && tail -f /dev/null"]
