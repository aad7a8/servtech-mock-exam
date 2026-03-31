import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./servtech.db')
LLM_API_KEY = os.getenv('LLM_API_KEY', '')
