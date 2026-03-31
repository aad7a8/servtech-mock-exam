# ServTech Knowledge Base — Mock Exam

## Overview

An **Equipment Knowledge Base Q&A System** for smart factories. Engineers can ask questions in natural language and get relevant answers from equipment manuals, SOPs, and maintenance records.

**Tech Stack:** FastAPI + SQLite (backend) | React + Material UI (frontend)

## Architecture

```
Frontend (React + MUI)          Backend (FastAPI)
┌────────────────────┐          ┌──────────────────────────┐
│ /documents         │  REST    │ POST /api/documents      │
│   - Table + CRUD   │ ◄─────► │ GET  /api/documents      │
│   - Filter by type │         │ GET  /api/documents/{id}  │
│ /query             │         │ DELETE /api/documents/{id}│
│   - Search input   │ ◄─────► │ POST /api/query           │
│   - Answer + Srcs  │         │   (keyword search)        │
└────────────────────┘          └──────────────────────────┘
                                          │
                                   SQLite (documents)
```

## Quick Start

### Backend

```bash
# From project root
pip install -r backend/requirements.txt
python -m backend.seed           # Load sample data
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker Compose

```bash
docker compose up --build
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/documents` | Create document (with validation) |
| GET    | `/api/documents` | List documents (`?equipment_type=CNC&tag=安全`) |
| GET    | `/api/documents/{id}` | Get single document |
| DELETE | `/api/documents/{id}` | Delete document |
| POST   | `/api/query` | Query knowledge base |

All responses follow unified format: `{ success, data, message }`

## Search Strategy

Currently using **Plan C (keyword match)** — question is split into keywords, each document is scored by hit count. Architecture supports swapping to TF-IDF, BM25, or embedding-based search via the `SearchService` abstraction.

## Design Decisions

- **SQLite** for simplicity in exam/demo context; easily swappable to PostgreSQL
- **Tags stored as JSON** in SQLite TEXT column — simpler than a relation table for this scale
- **Strategy pattern** for search — `search_service.py` can be replaced with TF-IDF/embedding without touching routes
- **MUI components** used throughout: Table, Dialog, Chip, Autocomplete, Accordion, Snackbar, Select
- **Unified API response format** with error codes for consistent frontend handling

## Project Structure

```
backend/
  main.py, config.py, database.py, models.py
  routers/   (documents.py, query.py)
  services/  (document_service.py, search_service.py, llm_service.py)
  tests/     (test_documents.py, test_query.py)
  seed.py    (test data loader)
frontend/
  src/
    App.jsx, index.js, theme.js
    pages/     (DocumentsPage.jsx, QueryPage.jsx)
    services/  (api.js)
docker-compose.yml
.github/workflows/ci.yml
```

## Tests

```bash
python -m pytest backend/tests/ -v
```

11 test cases covering CRUD operations, filtering, query search, and response structure.
