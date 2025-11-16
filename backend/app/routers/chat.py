"""
Chat endpoint for conversational AI
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import Conversation, Message
from app.schemas import ChatRequest, ChatResponse, MessageResponse
from app.llm_client import llm_client
from app.config import settings
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """Main chat endpoint"""
    try:
        if request.conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.id == request.conversation_id
            ).first()
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = Conversation(user_id="default_user", created_at=datetime.utcnow())
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        
        if settings.SAVE_HISTORY:
            user_message = Message(
                conversation_id=conversation.id,
                role="user",
                content=request.message,
                mode=request.mode,
                created_at=datetime.utcnow()
            )
            db.add(user_message)
            db.commit()
        
        if settings.SAVE_HISTORY:
            previous_messages = db.query(Message).filter(
                Message.conversation_id == conversation.id
            ).order_by(Message.created_at).all()
            
            messages_for_llm = [
                {"role": msg.role, "content": msg.content}
                for msg in previous_messages
            ]
        else:
            messages_for_llm = [{"role": "user", "content": request.message}]
        
        system_prompt = llm_client._get_system_prompt(request.mode)
        
        answer = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages_for_llm,
            mode=request.mode
        )
        
        if settings.SAVE_HISTORY:
            assistant_message = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=answer,
                mode=request.mode,
                created_at=datetime.utcnow()
            )
            db.add(assistant_message)
            db.commit()
            
            all_messages = db.query(Message).filter(
                Message.conversation_id == conversation.id
            ).order_by(Message.created_at).all()
            
            messages_response = [MessageResponse.model_validate(msg) for msg in all_messages]
        else:
            messages_response = []
        
        return ChatResponse(
            conversation_id=conversation.id,
            answer=answer,
            messages=messages_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

