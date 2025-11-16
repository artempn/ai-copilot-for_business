"""
Configuration module for the application
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Union


class Settings(BaseSettings):
    """Application settings"""
    
    # LLM Configuration
    LLM_PROVIDER: str = "ollama"
    LLM_MODEL: str = "llama3"
    LLM_BASE_URL: str = "http://llm:11434"
    LLM_TIMEOUT: int = 180
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./copilot.db"
    SAVE_HISTORY: bool = True
    
    # Application
    APP_NAME: str = "AI Copilot for Small Business"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS - can be set as comma-separated string in env or as list
    CORS_ORIGINS: Union[str, list[str]] = "http://localhost:3000,http://frontend:3000"
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

