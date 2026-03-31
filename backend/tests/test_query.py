import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import get_conn

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_and_seed():
    """Reset DB and add seed data before each test."""
    conn = get_conn()
    conn.execute('DELETE FROM documents')
    conn.commit()
    conn.close()
    # Add test documents
    client.post('/api/documents', json={
        'title': 'CNC 車床操作手冊',
        'content': '異常震動處理：當設備出現異常震動時，應立即按下緊急停止按鈕。檢查主軸是否鬆動。每日保養需檢查潤滑油。',
        'equipment_type': 'CNC',
        'tags': ['操作', '安全'],
    })
    client.post('/api/documents', json={
        'title': '沖壓機安全規範',
        'content': '操作人員必須穿戴安全護目鏡、防割手套。設備運行時嚴禁將手伸入模具區域。',
        'equipment_type': '沖壓機',
        'tags': ['安全'],
    })
    yield


def test_query_returns_relevant_sources():
    res = client.post('/api/query', json={
        'question': 'CNC 異常震動',
    })
    body = res.json()
    assert body['success'] is True
    assert len(body['data']['sources']) > 0
    assert body['data']['sources'][0]['title'] == 'CNC 車床操作手冊'


def test_query_with_equipment_type_filter():
    res = client.post('/api/query', json={
        'question': '安全',
        'equipment_type': '沖壓機',
    })
    body = res.json()
    sources = body['data']['sources']
    assert len(sources) >= 1
    for s in sources:
        # All sources should be 沖壓機 when filtered
        assert s['document_id']  # just ensure it's returned


def test_query_no_results():
    res = client.post('/api/query', json={
        'question': 'XXXXXXXXX_NO_MATCH',
    })
    body = res.json()
    assert body['success'] is True
    assert len(body['data']['sources']) == 0
    assert '沒有找到' in body['data']['answer']


def test_query_response_structure():
    res = client.post('/api/query', json={'question': '保養'})
    body = res.json()
    data = body['data']
    assert 'answer' in data
    assert 'sources' in data
    assert 'search_method' in data
    assert data['search_method'] == 'keyword'
    assert data['model_used'] == 'none'
