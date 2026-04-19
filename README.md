# To-Do Fullstack

Fullstack To-Do приложение с клиентом на **React + TypeScript + Vite** и сервером на **Node.js + Express + MongoDB**. В проекте есть авторизация, работа с задачами и разделение на frontend/backend в одном репозитории. Основа фронта построена вокруг **Redux Toolkit**, **React Router** и **Axios**. Основа бэка — **Express**, **Mongoose**, **JWT**, **cookie-parser** и сервисная структура по модулям. citeturn675508view0turn548074view0turn731189view0

## Стек

### Frontend
- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- SCSS

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- cookie-parser
- bcryptjs
- express-validator
- nodemailer

Список зависимостей и скриптов подтверждается `package.json`, а структура клиента и сервера — каталогами `src/` и `server/`. citeturn548074view0turn731189view1turn731189view0

## Структура проекта

```text
.
├── public/
├── server/
│   ├── Task/
│   ├── Token/
│   ├── User/
│   ├── config/
│   ├── dto/
│   ├── middleware/
│   ├── services/
│   ├── ApiError.js
│   └── index.js
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── redux/
│   ├── router/
│   ├── service/
│   ├── types/
│   ├── api.ts
│   ├── index.scss
│   └── main.tsx
├── package.json
└── vite.config.ts
```

Такая структура уже есть в репозитории: отдельно frontend в `src/` и backend в `server/`. citeturn731189view1turn731189view0

## Возможности

- регистрация и авторизация пользователя;
- хранение токенов и refresh-логика;
- создание, получение, обновление и удаление задач;
- роутинг на клиенте;
- централизованная работа с API через Axios;
- хранение состояния через Redux Toolkit.

Наличие модулей `Task`, `Token`, `User`, а также клиентских папок `redux`, `router`, `service` и файла `api.ts` указывает именно на такую функциональность. citeturn731189view0turn731189view1turn548074view2

## Запуск проекта

### 1. Клонировать репозиторий

```bash
git clone https://github.com/KubiDevCode/to-do-fullstack.git
cd to-do-fullstack
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Запустить frontend

```bash
npm run dev
```

По `package.json` dev-сервер фронта запускается через Vite. citeturn548074view0

### 4. Запустить backend

```bash
npm run serve
```

Сервер запускается командой `nodemon ./server/index.js`. citeturn548074view0

## Сборка

```bash
npm run build
```

Команда сборки запускает TypeScript build и затем Vite build. citeturn548074view0

## Линтинг

```bash
npm run lint
```

В проекте подключен ESLint. citeturn548074view0

## Конфигурация окружения

В серверной части используется `dotenv`, а точка входа подключает `./config/index.js`, поэтому проекту нужны переменные окружения для запуска. Кроме того, в `server/index.js` сейчас указан MongoDB URL и запуск сервера на порту `3000`. Для нормальной локальной разработки лучше вынести чувствительные данные в `.env`. citeturn548074view0turn548074view2

Пример `.env`:

```env
PORT=3000
DB_URL=mongodb://localhost:27017/todo
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
CLIENT_URL=http://localhost:5173
```

## API

Базовый префикс backend-маршрутов — `/todo`, потому что в `server/index.js` и task-router, и auth-router монтируются именно на этот путь. citeturn548074view2

Примерно проект ожидает такие группы маршрутов:

- `/todo/login`
- `/todo/registration`
- `/todo/refresh`
- `/todo/...` для операций с задачами


## Автор

**KubiDevCode**  
GitHub: https://github.com/KubiDevCode
