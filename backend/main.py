from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title='ServTech Knowledge Base', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

from backend.routers import documents, query  # noqa: E402

app.include_router(documents.router)
app.include_router(query.router)


@app.get('/')
def root():
    return {'success': True, 'data': 'ServTech API is running', 'message': ''}
