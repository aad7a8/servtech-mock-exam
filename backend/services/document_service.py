import json
import uuid
from datetime import datetime, timezone

try:
    from ..database import get_conn, row_to_dict
except ImportError:
    from database import get_conn, row_to_dict


def create_document(title: str, content: str, equipment_type: str, tags: list[str]) -> dict:
    conn = get_conn()
    doc_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        'INSERT INTO documents (id, title, content, equipment_type, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (doc_id, title, content, equipment_type, json.dumps(tags, ensure_ascii=False), now, now),
    )
    conn.commit()
    row = conn.execute('SELECT * FROM documents WHERE id = ?', (doc_id,)).fetchone()
    conn.close()
    return row_to_dict(row)


def list_documents(equipment_type: str | None = None, tag: str | None = None) -> list[dict]:
    conn = get_conn()
    query = 'SELECT * FROM documents'
    params: list = []
    conditions: list[str] = []

    if equipment_type:
        conditions.append('equipment_type = ?')
        params.append(equipment_type)

    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)

    query += ' ORDER BY created_at DESC'
    rows = conn.execute(query, params).fetchall()
    conn.close()

    results = [row_to_dict(r) for r in rows]

    # Filter by tag in Python (since tags is a JSON array stored as text)
    if tag:
        results = [r for r in results if tag in r['tags']]

    return results


def get_document(doc_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute('SELECT * FROM documents WHERE id = ?', (doc_id,)).fetchone()
    conn.close()
    if row is None:
        return None
    return row_to_dict(row)


def delete_document(doc_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute('SELECT * FROM documents WHERE id = ?', (doc_id,)).fetchone()
    if row is None:
        conn.close()
        return None
    conn.execute('DELETE FROM documents WHERE id = ?', (doc_id,))
    conn.commit()
    conn.close()
    return row_to_dict(row)


def get_all_documents() -> list[dict]:
    """Return all documents (used by search service)."""
    conn = get_conn()
    rows = conn.execute('SELECT * FROM documents ORDER BY created_at DESC').fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]
