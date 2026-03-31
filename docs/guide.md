# 🏭 科智企業 ServTech — 模擬上機考題 v2

> **考試時間：100 分鐘｜程式語言不限｜可使用 AI 輔助工具**
>
> 本題模擬科智企業面試上機考，請在 GitHub Codespaces 中完成前後端功能開發並串接。

---

## 📋 題目：智慧工廠設備知識庫問答系統

### 情境背景

科智企業的客戶（製造業工廠）擁有大量設備操作手冊、維修紀錄與 SOP 文件。
現在需要建立一個 **設備知識庫問答系統**，讓現場工程師能透過自然語言提問，
快速取得設備相關資訊，減少翻找紙本手冊的時間。

---

## 🎯 需求規格

### Part 1｜後端 API（建議 40 分鐘）

使用 Python（建議 FastAPI）建立以下 RESTful API。

> 所有 API 回應須符合統一格式：
> ```json
> { "success": true, "data": {}, "message": "" }
> ```
> 錯誤時：
> ```json
> { "success": false, "data": null, "message": "Document not found", "error_code": "DOC_NOT_FOUND" }
> ```

#### 1-1. 知識文件管理 CRUD

| 方法   | 路由                  | 功能             | 說明 |
| ------ | --------------------- | ---------------- | ---- |
| POST   | `/api/documents`      | 上傳知識文件     | 含輸入驗證 |
| GET    | `/api/documents`      | 列出所有文件     | 支援 `?equipment_type=CNC&tag=安全` 篩選 |
| GET    | `/api/documents/{id}` | 取得單一文件詳情 | 404 處理 |
| DELETE | `/api/documents/{id}` | 刪除文件         | 回傳被刪除的文件資訊 |

**Document 資料模型（請使用 Pydantic + Type Hint）：**

```python
class DocumentCreate(BaseModel):
    title: str                          # 必填，長度 1-200
    content: str                        # 必填，文件全文
    equipment_type: str                 # 必填，設備類型
    tags: list[str] = []                # 選填，標籤陣列

class DocumentResponse(BaseModel):
    id: str                             # UUID
    title: str
    content: str
    equipment_type: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime
```

**資料庫要求：**
- 使用 SQLite（考試環境）或 PostgreSQL
- 須有明確的 table schema 定義（ORM 或 raw SQL 皆可）
- 欄位型別須合理（如 tags 用 JSON 欄位或關聯表）

#### 1-2. 問答查詢 API

| 方法 | 路由         | 功能                               |
| ---- | ------------ | ---------------------------------- |
| POST | `/api/query` | 接收問題，回傳相關文件片段與 AI 回答 |

**Request：**

```json
{
  "question": "CNC 車床出現異常震動該怎麼處理？",
  "equipment_type": "CNC",
  "top_k": 3
}
```

**Response：**

```json
{
  "success": true,
  "data": {
    "answer": "根據操作手冊，CNC 車床異常震動的處理步驟為：1. 立即按下緊急停止...",
    "sources": [
      {
        "document_id": "uuid",
        "title": "CNC 車床操作手冊",
        "relevant_snippet": "當設備出現異常震動時，應先...",
        "relevance_score": 0.92
      }
    ],
    "search_method": "keyword | tfidf | embedding",
    "model_used": "gpt-4o | claude | none"
  }
}
```

**查詢邏輯（擇一實作，依時間決定深度）：**

| 方案 | 難度 | 檢索方式 | 回答生成 | 預估時間 |
| ---- | ---- | -------- | -------- | -------- |
| C（保底） | ⭐ | 關鍵字 split + 逐文件 match | 回傳匹配 snippet，不生成 | 15 min |
| B（標準） | ⭐⭐ | jieba 分詞 + TF-IDF / BM25 | 模板組合回答 | 25 min |
| A（推薦） | ⭐⭐⭐ | 同 B + 串接 LLM API | LLM 根據 context 生成回答 | 35 min |
| S（進階） | ⭐⭐⭐⭐ | Embedding 向量化 + 餘弦相似度 | LLM + source citation | 40+ min |

> **策略建議：先用方案 C 跑通全流程，再逐步升級。能 demo 的半成品 > 跑不動的完美架構。**

---

### Part 2｜前端介面（建議 40 分鐘）

使用 **React + Material UI** 建立 SPA。

> 注意：JD 明確要求 Material UI 實務經驗，前端請務必使用 MUI 元件庫。

#### 2-1. 文件管理頁 `/documents`

| 功能 | MUI 元件建議 | 必要性 |
| ---- | ------------ | ------ |
| 文件列表（title, equipment_type, tags, created_at） | `Table` 或 `Card` + `Chip` | 必做 |
| 新增文件表單 | `Dialog` + `TextField` + `Autocomplete`（tags） | 必做 |
| 刪除文件 | `IconButton` + 確認 `Dialog` | 必做 |
| equipment_type 篩選 | `Select` 或 `ToggleButtonGroup` | 必做 |
| 空狀態提示 | 自訂空狀態畫面 | 必做 |

#### 2-2. 問答查詢頁 `/query`

| 功能 | MUI 元件建議 | 必要性 |
| ---- | ------------ | ------ |
| 問題輸入框 | `TextField` + `Button` 或 `InputAdornment` | 必做 |
| AI 回答顯示 | `Card` or `Paper` | 必做 |
| 引用來源文件列表 | `Accordion` 或 `List`（含 relevance_score） | 必做 |
| Loading 狀態 | `Skeleton` 或 `CircularProgress` | 必做 |
| 設備類型篩選（optional filter） | `Select` | 加分 |
| 對話歷史 | 聊天氣泡 UI | 加分 |

#### 2-3. 整體前端要求

- **React Router** 做頁面切換，含 Navigation（`AppBar` + `Drawer` 或 `Tabs`）
- **API 串接** 封裝為獨立 service 模組（`src/services/api.js`）
- **錯誤處理**：API 失敗時顯示 `Snackbar` 或 `Alert` 提示
- **RWD**：使用 MUI `Grid` / `Container` + `useMediaQuery`，至少適配手機與桌面
- **jQuery 整合**（加分）：若有餘力，可在某處展示 jQuery 與 React 共存的處理方式（如第三方 legacy widget 整合）

---

### Part 3｜加分項目對照 JD

以下項目對應 JD 加分條件，**不強制但強烈建議至少完成 2-3 項**：

| 加分項 | 對應 JD | 實作建議 |
| ------ | ------- | -------- |
| Docker Compose 一鍵啟動 | Docker 容器化部署 | `docker-compose.yml` 含 frontend + backend + db |
| Git 規範 | Git 團隊協作 | 有意義的 commit message，至少 5+ commits，不要一次 push 全部 |
| Swagger 文件 | RESTful API 理解 | FastAPI 自動生成即可，加 description |
| LLM 串接 | LLM API / Prompt 設計 | 串 OpenAI 或 Anthropic API，設計 system prompt |
| 向量搜尋 | 向量資料庫經驗 | 用 FAISS 做 in-memory 向量檢索 |
| 單元測試 | 問題解決能力 | pytest 測 query API 至少 3 個 case |
| README.md | 產品思維 | 含架構圖、啟動步驟、設計決策說明 |
| CI/CD 設定 | DevOps 經驗 | GitHub Actions 跑 lint + test |

---

## 📐 評分標準（對應 JD 能力評估）

| 項目 | 比重 | 對應 JD 能力 | 評估重點 |
| ---- | ---- | ------------ | -------- |
| **功能正確性** | 30% | Python OOP + RESTful API | CRUD 正常運作、Query 回傳合理結果、HTTP status code 正確 |
| **前端完成度** | 20% | React + MUI 實務 | 元件使用是否道地、表單驗證、狀態管理合理性 |
| **前後端串接** | 15% | HTTP 協定 + 瀏覽器原理 | CORS 處理、錯誤處理、Loading 狀態、Request/Response 格式 |
| **程式碼品質** | 15% | OOP + 跨語言能力 | Type Hint、模組化、命名規範、適當註解、可讀性 |
| **AI 工具運用** | 10% | AI 賦能開發 | 使用 AI 的效率與方式、能解釋 AI 生成的程式碼 |
| **產品思維與討論** | 10% | 需求理解 + 優化方案 | 展示時的設計決策說明、回應修改需求的靈活度、擴展性思考 |

---

## 🗂 建議專案結構

```
servtech-knowledge-base/
├── backend/
│   ├── main.py                # FastAPI entry, CORS, lifespan
│   ├── config.py              # 環境變數、DB path、API keys
│   ├── database.py            # SQLite/PostgreSQL 連線 + schema init
│   ├── models.py              # Pydantic models (type-hint 嚴格定義)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── documents.py       # Document CRUD endpoints
│   │   └── query.py           # Query/search endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   ├── document_service.py  # DB 操作邏輯 (OOP)
│   │   ├── search_service.py    # 檢索邏輯 (策略模式，方便切換)
│   │   └── llm_service.py       # LLM API 串接 (可選)
│   ├── tests/
│   │   ├── test_documents.py
│   │   └── test_query.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── DocumentsPage.jsx    # 文件管理頁
│   │   │   └── QueryPage.jsx        # 問答查詢頁
│   │   ├── components/
│   │   │   ├── DocumentForm.jsx     # 新增文件 Dialog
│   │   │   ├── DocumentTable.jsx    # 文件列表 Table
│   │   │   ├── QueryInput.jsx       # 問題輸入區
│   │   │   ├── AnswerCard.jsx       # AI 回答卡片
│   │   │   └── SourceAccordion.jsx  # 引用來源展開
│   │   ├── services/
│   │   │   └── api.js               # API 串接封裝
│   │   └── theme.js                 # MUI 主題客製化
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml          # (加分) 一鍵啟動
├── .github/
│   └── workflows/
│       └── ci.yml              # (加分) GitHub Actions
└── README.md                   # 架構說明 + 啟動步驟 + 設計決策
```

---

## 🧪 預置測試資料

考試開始後，請先用 API 或 seed script 建立以下測試文件：

```json
[
  {
    "title": "CNC 車床操作手冊 v2.1",
    "content": "第一章：基本操作\n1.1 開機程序：先確認電源穩定，按下主電源開關，等待系統自檢完成（約30秒）。確認控制面板顯示正常後，執行原點復歸。\n1.2 異常震動處理：當設備出現異常震動時，應立即按下緊急停止按鈕，檢查主軸是否鬆動、刀具是否磨損、工件是否夾持不當。若主軸溫度超過 60°C，須等待冷卻至 40°C 以下方可重啟。\n1.3 日常保養：每日開機前檢查潤滑油位、清潔導軌、確認冷卻液量。每週檢查皮帶張力與過濾器。\n1.4 刀具更換：停機後將主軸移至換刀位置，鬆開刀柄夾頭，取出舊刀具。安裝新刀具後須重新對刀並更新刀補值。",
    "equipment_type": "CNC",
    "tags": ["操作", "安全", "維護", "刀具"]
  },
  {
    "title": "沖壓機安全規範 SOP-2024",
    "content": "安全規範概要：\n一、個人防護：操作人員必須穿戴安全護目鏡、防割手套及鋼頭安全鞋。長髮須束起，嚴禁佩戴戒指、手錶等飾品。\n二、操作規範：設備運行時嚴禁將手伸入模具區域。每次換模後須執行空行程測試至少3次。雙手操作按鈕間距須符合安全標準。\n三、異常處理：異常停機後須由技術主管確認方可重新啟動。發現模具裂紋應立即停機並通報。連續衝壓超過 2000 次須檢查模具磨損狀況。\n四、緊急應變：發生夾手事故時，立即按下急停並通知醫護。每月進行一次緊急疏散演練。",
    "equipment_type": "沖壓機",
    "tags": ["安全", "SOP", "緊急應變"]
  },
  {
    "title": "廠區設備總覽與維護排程 2024-Q4",
    "content": "一、設備統計：目前廠區共有設備 128 台，其中 CNC 車床 45 台、沖壓機 30 台、射出成型機 28 台、組裝線 25 條。\n二、維護排程：CNC 車床每 500 小時保養一次，沖壓機每 300 小時保養一次，射出成型機每 400 小時保養一次。\n三、停機分析：去年度非預期停機共 47 次，其中 60% 為 CNC 相關（主因：主軸磨損 40%、冷卻系統故障 35%、電控異常 25%），20% 為沖壓機（主因：模具損壞），20% 為其他設備。\n四、改善目標：本季目標將非預期停機降低至 30 次以下，導入 AI 預測性維護系統進行主軸振動監控。",
    "equipment_type": "綜合",
    "tags": ["維護", "排程", "統計", "AI預測"]
  },
  {
    "title": "射出成型機參數調整指南",
    "content": "一、溫度設定：料管溫度依材料而異，PP 為 200-230°C，ABS 為 220-260°C，PC 為 280-320°C。模具溫度建議 PP 為 40-60°C，ABS 為 60-80°C。\n二、壓力調整：射出壓力一般為機台最大壓力的 60-80%。保壓壓力為射出壓力的 50-70%。背壓建議 5-15 bar。\n三、常見不良與對策：短射→提高射出壓力或溫度；毛邊→降低鎖模力或射出壓力；縮水→延長保壓時間或提高保壓壓力；銀紋→檢查材料是否充分乾燥。\n四、換料程序：先清洗料管（用清洗料或下一批次材料），確認射出顏色正常後方可量產。",
    "equipment_type": "射出成型機",
    "tags": ["參數", "調整", "不良對策", "材料"]
  }
]
```

---

## 🎤 展示與討論階段（30 min）準備

面試官可能會問的問題與修改要求：

### (A) 功能正確性驗證
- 「新增一筆文件，然後查詢看看會不會出現」
- 「問一個跨設備的問題，例如『哪些設備需要每天保養？』」
- 「刪除一筆文件後，再查詢確認結果更新了」

### (B) 當場修改項目（預先準備思路）
- 「幫 Document 加一個 `priority` 欄位（high / medium / low），查詢時優先回傳高優先文件」
- 「前端加一個依 tag 篩選的功能」
- 「Query API 加上分頁（`page` + `page_size`）」
- 「把搜尋演算法從關鍵字改成 TF-IDF，你會怎麼改？」

### (C) 問題及強化討論
- 「如果文件量從 4 筆變成 10 萬筆，你的搜尋架構撐得住嗎？你會怎麼改？」
  - 提示：提到向量資料庫（FAISS / Qdrant）、索引、快取
- 「如果要支援 PDF 上傳，你的架構需要改哪些地方？」
  - 提示：PyPDF2 / pdfplumber 解析 → content 欄位
- 「如果多人同時查詢，LLM API 回應很慢怎麼辦？」
  - 提示：非同步處理、佇列、串流回應（SSE）、快取常見問題
- 「為什麼選擇這個搜尋方案？跟其他方案的 trade-off 是什麼？」
- 「這個系統要部署到 GCP，你會怎麼規劃？」
  - 提示：Cloud Run + Cloud SQL + GCS，對應科智實際用 GCP

### (D) 過往經驗連結
- 準備好說明你過去用 AI 工具提升開發效率的具體案例
- 準備一個 side project 或技術探索的故事
- 對 RAG 的理解：能畫出 Document → Chunk → Embed → Store → Retrieve → Generate 的流程

---

## ⏱ 面試當天時間軸建議

```
 0:00 ━━━ 讀題、開 Codespaces、確認環境 ━━━ 0:05
       ↓
 0:05 ━━━ 後端骨架：FastAPI + SQLite + models + CORS ━━━ 0:15
       ↓
 0:15 ━━━ Document CRUD 四支 API + 輸入驗證 ━━━ 0:35
       ↓
 0:35 ━━━ Query API（先做方案 C，能跑就好）━━━ 0:50
       ↓
 0:50 ━━━ 前端骨架：React Router + MUI Theme + 兩頁切換 ━━━ 0:58
       ↓
 0:58 ━━━ 文件管理頁：列表 + 新增 Dialog + 刪除 ━━━ 1:15
       ↓
 1:15 ━━━ 問答查詢頁：輸入框 + 回答卡片 + 來源列表 ━━━ 1:30
       ↓
 1:30 ━━━ 整體測試 + 灌測試資料 + 修 bug ━━━ 1:40
       ↓
      ⭐ 有餘力：升級搜尋方案 / 加 Docker / 補 README
```

---

## 💡 致勝提示

1. **先跑通再求好**：能 demo 的 60 分作品 >> 跑不起來的 100 分架構
2. **Git commit 要勤**：每完成一個功能就 commit，展現版控習慣（面試官看得到）
3. **搜尋方案用策略模式**：設計成可抽換的 `SearchService` 介面，展示時說「我目前用關鍵字，但架構上可以抽換成 TF-IDF 或 Embedding」，這句話值 10 分
4. **CORS 會卡你**：FastAPI 的 `CORSMiddleware` 一定要先設好，這是最常浪費時間的地方
5. **AI 工具大方用，但要能解釋**：面試官不會問你「是不是 AI 寫的」，會問「這段 code 在做什麼、為什麼這樣設計」
6. **README 是產品思維的展現**：哪怕只寫 10 行（架構 + 啟動指令 + 設計取捨），都比沒寫好