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
│   ├── users-search.ts     ← работаем здесь
│   └── user-card.ts        готовая карточка пользователя
├── api/                    клиент API и фейковый бэкенд (менять не нужно)
└── devtools/               панель Network (менять не нужно)
```
