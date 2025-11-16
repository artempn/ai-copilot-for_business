# Структура проекта

**Author:** Погосян Артем Артурович (Pogosian Artem)  
**VK:** https://vk.com/iamartempn

```
Case_from_Alpha/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI приложение
│   │   ├── config.py            # Конфигурация
│   │   ├── db.py                # Подключение к БД
│   │   ├── models.py            # ORM модели
│   │   ├── schemas.py           # Pydantic схемы
│   │   ├── llm_client.py        # Клиент для LLM
│   │   ├── deps.py              # Зависимости
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── chat.py          # Чат эндпоинт
│   │       ├── usecases.py      # Быстрые сценарии
│   │       └── health.py        # Health check
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── api/
│   │   │   └── client.ts        # API клиент
│   │   └── components/
│   │       ├── Chat.tsx
│   │       ├── Chat.css
│   │       ├── Sidebar.tsx
│   │       ├── Sidebar.css
│   │       ├── QuickActions.tsx
│   │       └── QuickActions.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── nginx.conf
│   └── Dockerfile
├── docs/
│   └── ARCHITECTURE.md
├── docker-compose.yml
├── README.md
├── .gitignore
└── PROJECT_STRUCTURE.md
```

