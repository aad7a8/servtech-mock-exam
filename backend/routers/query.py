from fastapi import APIRouter
from backend.models import QueryRequest
from backend.services import document_service
from backend.services.search_service import search_keyword

router = APIRouter(prefix='/api/query', tags=['query'])


@router.post('')
def query_documents(body: QueryRequest):
    all_docs = document_service.get_all_documents()
    sources = search_keyword(
        question=body.question,
        documents=all_docs,
        equipment_type=body.equipment_type,
        top_k=body.top_k,
    )

    if sources:
        snippets = '\n'.join(f"- {s['title']}: {s['relevant_snippet']}" for s in sources)
        answer = f"根據知識庫中的相關文件，以下為與您問題相關的資訊：\n{snippets}"
    else:
        answer = '抱歉，知識庫中沒有找到與您問題相關的文件。'

    return {
        'success': True,
        'data': {
            'answer': answer,
            'sources': sources,
            'search_method': 'keyword',
            'model_used': 'none',
        },
        'message': '',
    }
