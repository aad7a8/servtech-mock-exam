from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = 'sqlite:///./servtech.db'

settings = Settings()
