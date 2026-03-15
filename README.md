# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.)

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

- `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb`
- `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

## Docker Compose (production-like)

В репозитории добавлены:

- `frontend/Dockerfile` — сборка фронтенда и копирование `dist` в volume.
- `backend/Dockerfile` — сборка и запуск NestJS из `dist/main.js`.
- `nginx/Dockerfile` + `nginx/default.conf` — раздача фронтенда и проксирование `/api/` и `/content/`.
- `docker-compose.yml` — запуск сервисов `frontend`, `backend`, `database`, `nginx`, `pgadmin`.
- `.env.example` (в корне) — пример переменных окружения для compose-сервисов.

Запуск:

```bash
cp .env.example .env
docker compose up -d --build
```

Проверка:

- Приложение: `http://localhost:80`
- pgAdmin: `http://localhost:8080`
  - Login: `admin@admin.com`
  - Password: `admin`

Остановка:

```bash
docker compose down
```

## GHCR Build & Publish

Добавлен workflow `.github/workflows/docker-images.yml`, который:

- поднимает Buildx (`docker/setup-buildx-action@v3`);
- собирает образы `frontend`, `backend`, `nginx`;
- публикует их в `ghcr.io` через `GITHUB_TOKEN`.

## Продакшен

- Фронтенд: `http://film.frontend.nomorepartiessite.ru`
- Бэкенд API: `http://film.backend.nomorepartiessite.ru/api/afisha/films`
- pgAdmin: `http://film.backend.nomorepartiessite.ru:8080` (на время наполнения БД)

## Continuous Delivery

Добавлен workflow `.github/workflows/deploy-server.yml`:

- запускается после успешного `Build and Publish Docker Images` (или вручную);
- подключается к серверу по SSH;
- делает `docker compose pull` и `docker compose up -d` для `frontend/backend/nginx`.

Нужные Secrets в GitHub:

- `DEPLOY_HOST` — IP или домен сервера.
- `DEPLOY_USER` — SSH-пользователь на сервере.
- `DEPLOY_SSH_KEY` — приватный SSH-ключ для доступа к серверу.
