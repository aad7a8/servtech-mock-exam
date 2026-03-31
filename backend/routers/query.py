from fastapi import APIRouter

router = APIRouter(prefix='/api/query', tags=['query'])

@router.post('')
def query_documents():
    return {
        'success': True,
        'data': {
            'answer': '目前使用關鍵字檢索，結果待實作',
            'sources': [],
            'search_method': 'keyword',
            'model_used': 'none',
        },
        'message': ''
    }
