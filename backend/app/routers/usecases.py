"""
Predefined use cases endpoints
Author: Погосян Артем Артурович (Pogosian Artem)
VK: https://vk.com/iamartempn
"""
from fastapi import APIRouter, HTTPException
from app.schemas import (
    LegalContractRequest, LegalContractResponse,
    MarketingPostRequest, MarketingPostResponse,
    FinanceReportRequest, FinanceReportResponse,
    SummaryRequest, SummaryResponse,
    CompanyCardRequest, CompanyCardResponse,
    TaxConsultationRequest, TaxConsultationResponse
)
from app.llm_client import llm_client

router = APIRouter(prefix="/api/usecases", tags=["usecases"])


@router.post("/legal-contract", response_model=LegalContractResponse)
async def legal_contract(request: LegalContractRequest):
    """Generate legal contract draft"""
    try:
        prompt = f"""Составь черновик договора типа "{request.contract_type}".

Стороны: {request.parties}
Предмет договора: {request.subject}
{f'Сумма/цена: {request.amount}' if request.amount else ''}
{f'Дополнительная информация: {request.additional_info}' if request.additional_info else ''}

Создай структурированный текст договора с основными разделами:
1. Преамбула (стороны договора)
2. Предмет договора
3. Права и обязанности сторон
4. Сумма и порядок расчетов
5. Сроки
6. Ответственность сторон
7. Прочие условия
8. Реквизиты и подписи

ВАЖНО: В конце договора обязательно добавь предупреждение о том, что это черновик и для финального использования необходимо обратиться к юристу."""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("legal")
        
        contract_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="legal"
        )
        
        return LegalContractResponse(
            contract_text=contract_text,
            warnings=[
                "Это черновик договора. Для финального использования обязательно обратитесь к квалифицированному юристу.",
                "Договор не является юридической гарантией и требует профессиональной проверки."
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating contract: {str(e)}")


@router.post("/marketing-post", response_model=MarketingPostResponse)
async def marketing_post(request: MarketingPostRequest):
    """Generate marketing post"""
    try:
        prompt = f"""Создай несколько вариантов промо-поста для социальных сетей.

Описание бизнеса: {request.business_description}
Цель промоакции: {request.promotion_goal}
Платформа: {request.platform}
{f'Целевая аудитория: {request.target_audience}' if request.target_audience else ''}
Тон: {request.tone}

Создай 3-5 вариантов постов разной длины и стиля. Каждый пост должен быть:
- Привлекательным и цепляющим
- Соответствовать платформе {request.platform}
- Включать призыв к действию
- Быть готовым к публикации"""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("marketing")
        
        response_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="marketing"
        )
        
        posts = []
        lines = response_text.split('\n')
        current_post = []
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_post:
                    posts.append('\n'.join(current_post))
                    current_post = []
                continue
            
            if line.startswith(('1.', '2.', '3.', '4.', '5.', 'Вариант', '---', '===')):
                if current_post:
                    posts.append('\n'.join(current_post))
                    current_post = []
                if not line.startswith('---'):
                    current_post.append(line)
            else:
                current_post.append(line)
        
        if current_post:
            posts.append('\n'.join(current_post))
        
        if not posts:
            posts = [response_text]
        
        return MarketingPostResponse(posts=posts[:5])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating post: {str(e)}")


@router.post("/finance-report", response_model=FinanceReportResponse)
async def finance_report(request: FinanceReportRequest):
    """Generate finance report and analysis"""
    try:
        data_desc = []
        if request.sales_data:
            data_desc.append(f"Данные по продажам: {request.sales_data}")
        if request.expenses_data:
            data_desc.append(f"Данные по расходам: {request.expenses_data}")
        if request.period:
            data_desc.append(f"Период: {request.period}")
        
        prompt = f"""Проанализируй финансовые данные малого бизнеса и дай рекомендации.

{chr(10).join(data_desc) if data_desc else 'Данные не предоставлены, дай общие рекомендации по управлению финансами малого бизнеса.'}

{f'Конкретные вопросы: {request.questions}' if request.questions else ''}

Сделай:
1. Краткий анализ (если есть данные)
2. Список рекомендаций по улучшению финансового состояния
3. Укажи на возможные риски

ВАЖНО: Всегда напоминай, что это общие рекомендации и для серьёзных финансовых решений нужно обратиться к финансовому консультанту."""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("finance")
        
        analysis_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="finance"
        )
        
        recommendations = []
        warnings = []
        
        lines = analysis_text.split('\n')
        in_recommendations = False
        in_warnings = False
        
        for line in lines:
            line_lower = line.lower()
            if 'рекомендац' in line_lower or 'совет' in line_lower:
                in_recommendations = True
                in_warnings = False
            elif 'риск' in line_lower or 'предупрежден' in line_lower or 'важно' in line_lower:
                in_warnings = True
                in_recommendations = False
            
            if line.strip() and (line.strip().startswith('-') or line.strip().startswith('•') or line.strip()[0].isdigit()):
                if in_recommendations:
                    recommendations.append(line.strip().lstrip('- •0123456789. '))
                elif in_warnings:
                    warnings.append(line.strip().lstrip('- •0123456789. '))
        
        if not warnings:
            warnings = [
                "Это общие рекомендации. Для серьёзных финансовых решений обратитесь к финансовому консультанту.",
                "Анализ основан на предоставленных данных и может не учитывать все нюансы вашего бизнеса."
            ]
        
        return FinanceReportResponse(
            analysis=analysis_text,
            recommendations=recommendations[:10] if recommendations else [],
            warnings=warnings
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


@router.post("/summary", response_model=SummaryResponse)
async def summary(request: SummaryRequest):
    """Summarize text and extract tasks"""
    try:
        prompt = f"""Резюмируй следующий текст и выдели ключевые моменты:

{request.text}

Тип резюме: {request.summary_type}

Сделай:
1. Краткое резюме основных моментов
2. Список задач (если применимо)
3. Следующие шаги (если применимо)

Будь конкретным и структурированным."""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("summary")
        
        summary_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="summary"
        )
        
        tasks = []
        next_steps = []
        
        lines = summary_text.split('\n')
        in_tasks = False
        in_steps = False
        
        for line in lines:
            line_lower = line.lower()
            if 'задач' in line_lower or 'todo' in line_lower:
                in_tasks = True
                in_steps = False
            elif 'шаг' in line_lower or 'действ' in line_lower or 'next' in line_lower:
                in_steps = True
                in_tasks = False
            
            if line.strip() and (line.strip().startswith('-') or line.strip().startswith('•') or line.strip()[0].isdigit()):
                clean_line = line.strip().lstrip('- •0123456789. ')
                if in_tasks and clean_line:
                    tasks.append(clean_line)
                elif in_steps and clean_line:
                    next_steps.append(clean_line)
        
        return SummaryResponse(
            summary=summary_text,
            tasks=tasks[:20] if tasks else [],
            next_steps=next_steps[:20] if next_steps else []
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")


@router.post("/company-card", response_model=CompanyCardResponse)
async def company_card(request: CompanyCardRequest):
    """Generate company card based on provided information"""
    try:
        info_parts = []
        if request.inn:
            info_parts.append(f"ИНН: {request.inn}")
        if request.company_name:
            info_parts.append(f"Название: {request.company_name}")
        if request.address:
            info_parts.append(f"Адрес: {request.address}")
        if request.additional_info:
            info_parts.append(f"Дополнительно: {request.additional_info}")
        
        prompt = f"""Создай карточку компании на основе предоставленной информации.

{chr(10).join(info_parts) if info_parts else 'Информация не предоставлена. Дай общую структуру карточки компании.'}

Создай структурированную карточку компании, включающую:
1. Основная информация (название, ИНН, ОГРН если известен)
2. Вид деятельности (ОКВЭД, если можно определить)
3. Налоговый режим (если можно определить)
4. Контакты (адрес, телефон, email если известны)
5. Рекомендации по работе с компанией
6. Потенциальные риски (если применимо)

ВАЖНО: Если информации недостаточно, укажи это и предложи, где её можно найти."""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("company")
        
        card_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="company"
        )
        
        recommendations = []
        lines = card_text.split('\n')
        in_recommendations = False
        
        for line in lines:
            line_lower = line.lower()
            if 'рекомендац' in line_lower or 'совет' in line_lower:
                in_recommendations = True
            elif line.strip() and in_recommendations:
                if line.strip().startswith(('-', '•', '*')) or line.strip()[0].isdigit():
                    recommendations.append(line.strip().lstrip('- •*0123456789. '))
        
        return CompanyCardResponse(
            card_text=card_text,
            recommendations=recommendations[:10] if recommendations else []
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating company card: {str(e)}")


@router.post("/tax-consultation", response_model=TaxConsultationResponse)
async def tax_consultation(request: TaxConsultationRequest):
    """Provide tax consultation"""
    try:
        context_parts = []
        if request.business_type:
            context_parts.append(f"Тип бизнеса: {request.business_type}")
        if request.tax_regime:
            context_parts.append(f"Налоговый режим: {request.tax_regime}")
        if request.revenue:
            context_parts.append(f"Выручка: {request.revenue} руб.")
        if request.additional_context:
            context_parts.append(f"Контекст: {request.additional_context}")
        
        prompt = f"""Ответь на вопрос о налогах для малого бизнеса в России.

Вопрос: {request.question}

{chr(10).join(context_parts) if context_parts else ''}

Дай подробный, структурированный ответ:
1. Прямой ответ на вопрос
2. Объяснение (если нужно)
3. Примеры расчётов (если применимо)
4. Практические рекомендации
5. Важные предупреждения

ВАЖНО: Всегда напоминай, что для точных расчётов нужно обратиться к бухгалтеру или налоговому консультанту."""
        
        messages = [{"role": "user", "content": prompt}]
        system_prompt = llm_client._get_system_prompt("taxes")
        
        answer_text = await llm_client.generate_response(
            system_prompt=system_prompt,
            messages=messages,
            mode="taxes"
        )
        
        calculations = None
        warnings = [
            "⚠️ Это общая информация. Для точных расчётов обратитесь к бухгалтеру или налоговому консультанту.",
            "Налоговое законодательство может изменяться. Проверяйте актуальность информации."
        ]
        
        return TaxConsultationResponse(
            answer=answer_text,
            calculations=calculations,
            warnings=warnings
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error providing tax consultation: {str(e)}")

