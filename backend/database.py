import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / 'servtech.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        equipment_type TEXT NOT NULL,
        tags TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
