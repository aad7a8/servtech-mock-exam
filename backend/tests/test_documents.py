import pytest
from fastapi.testclient import TestClient
try:
    from backend.main import app
    from backend.database import get_conn, init_db
except ImportError:
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from backend.main import app
    from backend.database import get_conn, init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    """Reset DB before each test."""
    conn = get_conn()
    conn.execute('DELETE FROM documents')
    conn.commit()
    conn.close()
    yield


def _create_sample():
    return client.post('/api/documents', json={
        'title': 'Test Doc',
        'content': 'Some content about CNC machines',
        'equipment_type': 'CNC',
        'tags': ['test', 'safety'],
    })


def test_create_document():
    res = _create_sample()
    assert res.status_code == 201
    body = res.json()
    assert body['success'] is True
    assert body['data']['title'] == 'Test Doc'
    assert body['data']['equipment_type'] == 'CNC'
    assert 'id' in body['data']


def test_list_documents():
    _create_sample()
    _create_sample()
    res = client.get('/api/documents')
    assert res.status_code == 200
    assert len(res.json()['data']) == 2


def test_list_documents_filter_equipment_type():
    _create_sample()
    client.post('/api/documents', json={
        'title': 'Press Doc',
        'content': 'Press machine content',
        'equipment_type': '沖壓機',
        'tags': [],
    })
    res = client.get('/api/documents?equipment_type=CNC')
    data = res.json()['data']
    assert len(data) == 1
    assert data[0]['equipment_type'] == 'CNC'


def test_get_document():
    create_res = _create_sample()
    doc_id = create_res.json()['data']['id']
    res = client.get(f'/api/documents/{doc_id}')
    assert res.status_code == 200
    assert res.json()['data']['id'] == doc_id


def test_get_document_not_found():
    res = client.get('/api/documents/nonexistent-id')
    assert res.json()['success'] is False
    assert res.json()['error_code'] == 'DOC_NOT_FOUND'


def test_delete_document():
    create_res = _create_sample()
    doc_id = create_res.json()['data']['id']
    res = client.delete(f'/api/documents/{doc_id}')
    assert res.json()['success'] is True
    assert res.json()['data']['id'] == doc_id
    # Verify deleted
    res2 = client.get(f'/api/documents/{doc_id}')
    assert res2.json()['success'] is False


def test_create_document_validation():
    res = client.post('/api/documents', json={
        'title': '',
        'content': 'x',
        'equipment_type': 'CNC',
    })
    assert res.status_code == 422
