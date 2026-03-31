from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='ServTech Knowledge Base')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

from backend.routers import documents, query

app.include_router(documents.router)
app.include_router(query.router)

@app.get('/')
def root():
    return {'success': True, 'data': 'ServTech API is running', 'message': ''}
