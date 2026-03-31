from fastapi import APIRouter, HTTPException

try:
    from ..models import DocumentCreate, DocumentResponse
    from ..services import document_service
except ImportError:
    from models import DocumentCreate, DocumentResponse
    from services import document_service

router = APIRouter(prefix='/api/documents', tags=['documents'])


@router.post('', status_code=201)
def create_document(body: DocumentCreate):
    doc = document_service.create_document(
        title=body.title,
        content=body.content,
        equipment_type=body.equipment_type,
        tags=body.tags,
    )
    return {'success': True, 'data': doc, 'message': 'Document created'}


@router.get('')
def list_documents(equipment_type: str | None = None, tag: str | None = None):
    docs = document_service.list_documents(equipment_type=equipment_type, tag=tag)
    return {'success': True, 'data': docs, 'message': ''}


@router.get('/{doc_id}')
def get_document(doc_id: str):
    doc = document_service.get_document(doc_id)
    if doc is None:
        return {
            'success': False,
            'data': None,
            'message': 'Document not found',
            'error_code': 'DOC_NOT_FOUND',
        }
    return {'success': True, 'data': doc, 'message': ''}


@router.delete('/{doc_id}')
def delete_document(doc_id: str):
    doc = document_service.delete_document(doc_id)
    if doc is None:
        return {
            'success': False,
            'data': None,
            'message': 'Document not found',
            'error_code': 'DOC_NOT_FOUND',
        }
    return {'success': True, 'data': doc, 'message': 'Document deleted'}
