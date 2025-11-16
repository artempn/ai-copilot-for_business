"""
Dependencies for FastAPI routes
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from sqlalchemy.orm import Session
from app.db import get_db
from app.llm_client import llm_client


def get_llm_client():
    """Dependency for LLM client"""
    return llm_client

