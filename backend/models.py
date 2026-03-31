from datetime import datetime
from pydantic import BaseModel, Field
from typing import List

class DocumentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    equipment_type: str
    tags: List[str] = []

class DocumentResponse(DocumentCreate):
    id: str
    created_at: datetime
    updated_at: datetime

class QueryRequest(BaseModel):
    question: str
    equipment_type: str | None = None
    top_k: int = 3

class QueryResultSource(BaseModel):
    document_id: str
    title: str
    relevant_snippet: str
    relevance_score: float

class QueryResponseData(BaseModel):
    answer: str
    sources: List[QueryResultSource]
    search_method: str
    model_used: str
