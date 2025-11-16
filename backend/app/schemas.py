"""
Pydantic schemas for request/response validation
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageBase(BaseModel):
    """Base message schema"""
    role: str
    content: str
    mode: Optional[str] = None


class MessageCreate(MessageBase):
    """Schema for creating a message"""
    pass


class MessageResponse(MessageBase):
    """Schema for message response"""
    id: int
    conversation_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    """Request schema for chat endpoint"""
    message: str = Field(..., description="User message")
    mode: str = Field(default="general", description="Chat mode: general, legal, marketing, finance, summary")
    conversation_id: Optional[int] = Field(None, description="Existing conversation ID")


class ChatResponse(BaseModel):
    """Response schema for chat endpoint"""
    conversation_id: int
    answer: str
    messages: List[MessageResponse] = []


class LegalContractRequest(BaseModel):
    """Request schema for legal contract usecase"""
    contract_type: str = Field(..., description="Type of contract (e.g., 'rental', 'service', 'supply')")
    parties: str = Field(..., description="Parties involved")
    subject: str = Field(..., description="Subject of contract")
    amount: Optional[str] = Field(None, description="Amount or price")
    additional_info: Optional[str] = Field(None, description="Additional information")


class LegalContractResponse(BaseModel):
    """Response schema for legal contract usecase"""
    contract_text: str
    warnings: List[str] = []


class MarketingPostRequest(BaseModel):
    """Request schema for marketing post usecase"""
    business_description: str = Field(..., description="Description of the business")
    promotion_goal: str = Field(..., description="Goal of the promotion")
    platform: str = Field(default="general", description="Platform: instagram, vk, telegram, general")
    target_audience: Optional[str] = Field(None, description="Target audience")
    tone: Optional[str] = Field("friendly", description="Tone: friendly, professional, casual")


class MarketingPostResponse(BaseModel):
    """Response schema for marketing post usecase"""
    posts: List[str] = []


class FinanceReportRequest(BaseModel):
    """Request schema for finance report usecase"""
    sales_data: Optional[dict] = Field(None, description="Sales data")
    expenses_data: Optional[dict] = Field(None, description="Expenses data")
    period: Optional[str] = Field(None, description="Period description")
    questions: Optional[str] = Field(None, description="Specific questions about finances")


class FinanceReportResponse(BaseModel):
    """Response schema for finance report usecase"""
    analysis: str
    recommendations: List[str] = []
    warnings: List[str] = []


class SummaryRequest(BaseModel):
    """Request schema for summary usecase"""
    text: str = Field(..., description="Text to summarize")
    summary_type: Optional[str] = Field("general", description="Type: general, tasks, next_steps")


class SummaryResponse(BaseModel):
    """Response schema for summary usecase"""
    summary: str
    tasks: List[str] = []
    next_steps: List[str] = []


class CompanyCardRequest(BaseModel):
    """Request schema for company card usecase"""
    inn: Optional[str] = Field(None, description="ИНН компании")
    company_name: Optional[str] = Field(None, description="Название компании")
    address: Optional[str] = Field(None, description="Адрес компании")
    additional_info: Optional[str] = Field(None, description="Дополнительная информация")


class CompanyCardResponse(BaseModel):
    """Response schema for company card usecase"""
    card_text: str
    structured_data: Optional[dict] = None
    recommendations: List[str] = []


class TaxConsultationRequest(BaseModel):
    """Request schema for tax consultation usecase"""
    question: str = Field(..., description="Вопрос о налогах")
    business_type: Optional[str] = Field(None, description="Тип бизнеса: ИП, ООО")
    tax_regime: Optional[str] = Field(None, description="Налоговый режим: УСН, ОСН, ПСН, ЕНВД")
    revenue: Optional[float] = Field(None, description="Выручка (для расчётов)")
    additional_context: Optional[str] = Field(None, description="Дополнительный контекст")


class TaxConsultationResponse(BaseModel):
    """Response schema for tax consultation usecase"""
    answer: str
    calculations: Optional[dict] = None
    warnings: List[str] = []


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    llm_status: Optional[str] = None

