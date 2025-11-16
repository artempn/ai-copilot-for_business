"""
Health check endpoint
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from fastapi import APIRouter, Depends
from app.schemas import HealthResponse
from app.llm_client import llm_client

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    llm_status = "ok" if await llm_client.check_health() else "unavailable"
    return HealthResponse(status="ok", llm_status=llm_status)

