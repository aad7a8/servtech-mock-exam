# WBS（工作拆解）

## 目前進度（已完成）

1. 目錄結構初始化
   - `backend/`, `frontend/`, `.github/workflows/` 建立
   - `docker-compose.yml` 建立
2. 後端基礎骨架
   - `backend/main.py` (FastAPI + CORS + 根路由)
   - `backend/config.py` (設定)
   - `backend/database.py` (SQLite schema init)
   - `backend/models.py` (Pydantic model scaffold)
   - `backend/routers/`
     - `documents.py`, `query.py` scaffold endpoint
   - `backend/services/`
     - `document_service.py`, `search_service.py`, `llm_service.py` placeholder
   - `backend/tests/`
     - `test_documents.py`, `test_query.py` placeholder
   - `backend/Dockerfile`
3. 前端基礎骨架
   - `frontend/package.json`
   - `frontend/src/App.jsx` (Router + AppBar)
   - `frontend/src/pages/DocumentsPage.jsx`, `QueryPage.jsx` (skeleton)
   - `frontend/src/services/api.js` (axios API client)
   - `frontend/Dockerfile`
4. CI / 加分項目
   - `.github/workflows/ci.yml`（pytest job）
   - `README.md` 更新（架構說明、啟動指令、進度說明）

## 後續待做

- 完成 Document CRUD API（`/api/documents`）
- 完成 Query API（`/api/query`）方案 C（keyword match）
- 前端 Documents 和 Query 互動型 UI 與錯誤提示
- 單元測試補足至少 3 個核心 case
- 進階：TF-IDF/Embedding、LLM 詢問回傳、Docker compose 穩定運行
