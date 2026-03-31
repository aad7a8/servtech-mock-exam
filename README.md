# servtech-mock-exam

## 專案概述

這是一個 **智慧工廠設備知識庫問答系統** 的範例專案，依據題目建議結構建立最小可運行後端與前端骨架。

主要目標：
- 後端：FastAPI + SQLite CRUD API、Query API、CORS
- 前端：React + MUI + React Router
- 專案結構：backend/frontend + Docker Compose + CI

## 專案結構

- backend/
  - main.py
  - config.py
  - database.py
  - models.py
  - routers/
    - documents.py
    - query.py
  - services/
    - document_service.py
    - search_service.py
    - llm_service.py
  - tests/
    - test_documents.py
    - test_query.py
  - Dockerfile
- frontend/
  - package.json
  - src/
    - App.jsx
    - pages/
      - DocumentsPage.jsx
      - QueryPage.jsx
    - services/
      - api.js
  - Dockerfile
- docker-compose.yml
- .github/workflows/ci.yml

## 快速啟動

1. 後端

```bash
cd /workspaces/servtech-mock-exam
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

2. 前端（假設使用 Create React App 相關環境）

```bash
cd /workspaces/servtech-mock-exam/frontend
npm install
npm start
```

3. (可選) Docker Compose

```bash
cd /workspaces/servtech-mock-exam
docker compose up --build
```

## 說明

- 後端 API 路由已搭建並回傳統一格式，未完成的部分使用 placeholder。
- Query API 目前回傳 sample answer，後續可擴增關鍵字匹配/TF-IDF/向量檢索。
- 已加入 CI workflow 作為加分項目。

## 後續可做

- 完成 CRUD邏輯與資料庫串接
- 加入文件篩選、分頁、異常處理
- 完整前端文件管理與查詢介面
- 加入 LLM API 串接至 query API
