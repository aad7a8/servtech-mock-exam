# WBS（工作拆解）

## 已完成

1. 目錄結構初始化
   - `backend/`, `frontend/`, `.github/workflows/` 建立
   - `docker-compose.yml` 建立
2. 後端基礎骨架
   - `backend/main.py` (FastAPI + CORS + lifespan)
   - `backend/config.py` (設定)
   - `backend/database.py` (SQLite schema init + connection helper)
   - `backend/models.py` (Pydantic models with validation)
   - `backend/routers/documents.py` — 完整 CRUD (POST, GET list, GET by id, DELETE)
   - `backend/routers/query.py` — keyword search + answer generation
   - `backend/services/document_service.py` — DB CRUD business logic
   - `backend/services/search_service.py` — Plan C keyword split + match
   - `backend/seed.py` — 4 筆預置測試資料
   - `backend/requirements.txt`
3. 前端完整實作
   - `frontend/src/App.jsx` (Router + AppBar + ThemeProvider)
   - `frontend/src/theme.js` (MUI theme customization)
   - `frontend/src/index.js` (React entry point)
   - `frontend/public/index.html`
   - `frontend/src/pages/DocumentsPage.jsx`
     - Table 列表 + Chip tags + equipment_type filter (Select)
     - 新增文件 Dialog (TextField + Select + Autocomplete tags)
     - 刪除確認 Dialog
     - 空狀態提示 + Loading spinner
     - Snackbar error/success 通知
   - `frontend/src/pages/QueryPage.jsx`
     - 問題輸入 (TextField + InputAdornment)
     - Equipment type filter (Select)
     - Answer Card + search method/model chips
     - Source Accordion with relevance score
     - Loading (LinearProgress)
     - Error Alert
     - 查詢歷史 (Previous Queries)
     - 空狀態提示
   - `frontend/src/services/api.js` (axios — fetch, get, create, delete, query)
4. 測試
   - `backend/tests/test_documents.py` — 7 test cases (CRUD + filter + validation)
   - `backend/tests/test_query.py` — 4 test cases (search + filter + structure)
5. CI / 加分項目
   - `.github/workflows/ci.yml`（pytest job）
   - `docker-compose.yml` (backend + frontend)
   - `README.md`（架構圖、啟動指令、設計決策）

## 後續可做（進階）

- 升級搜尋：jieba 分詞 + TF-IDF / BM25（方案 B）
- LLM 串接：Anthropic / OpenAI API 生成回答（方案 A）
- Embedding 向量搜尋：FAISS in-memory（方案 S）
- Docker Compose 穩定運行驗證
- 前端 RWD 細節優化（useMediaQuery）
- jQuery legacy widget 整合展示
