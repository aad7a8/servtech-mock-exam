from fastapi import APIRouter, HTTPException

router = APIRouter(prefix='/api/documents', tags=['documents'])

@router.get('')
def list_documents():
    return {'success': True, 'data': [], 'message': 'Not implemented yet'}

@router.post('')
def create_document():
    return {'success': True, 'data': None, 'message': 'Not implemented yet'}

@router.get('/{doc_id}')
def get_document(doc_id: str):
    raise HTTPException(status_code=404, detail='Not implemented')

@router.delete('/{doc_id}')
def delete_document(doc_id: str):
    return {'success': True, 'data': None, 'message': 'Not implemented yet'}
