# Angular live-coding sandbox: поиск пользователей

Условие задачи — в [TASK.md](./TASK.md).

## Запуск

StackBlitz: откройте проект и дождитесь установки зависимостей, приложение запустится само.

Локально (Node.js 22.22.3+ или 24.15+):

```bash
npm install
npm start
```

Приложение откроется на http://localhost:4200.

## Структура

```
src/app/
├── users-search/
│   ├── users-search.ts   ← задачи 1 и 2
│   └── user-card.ts      готовая карточка пользователя
├── favorites/
│   └── favorites.store.ts ← задача 3
└── api/                  клиенты API (менять не нужно)
mock-server/              фейковый бэкенд, его отдаёт ng serve (менять не нужно)
```
