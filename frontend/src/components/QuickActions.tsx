// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import { useState } from 'react'
import { api } from '../api/client'
import './QuickActions.css'

interface QuickActionsProps {
  onActionComplete: () => void
}

const QuickActions = ({ onActionComplete: _onActionComplete }: QuickActionsProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const actions = [
    { id: 'contract', label: 'Составить договор', icon: '📄' },
    { id: 'post', label: 'Создать промо-пост', icon: '📢' },
    { id: 'finance', label: 'Финансовый отчёт', icon: '💰' },
    { id: 'summary', label: 'Резюме текста', icon: '📝' },
    { id: 'company', label: 'Карточка компании', icon: '🏢' },
    { id: 'taxes', label: 'Консультация по налогам', icon: '📊' },
  ]

  const handleContract = async (data: any) => {
    setLoading(true)
    try {
      const response = await api.legalContract(data)
      setResult(response.contract_text)
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  const handlePost = async (data: any) => {
    setLoading(true)
    try {
      const response = await api.marketingPost(data)
      setResult(response.posts.join('\n\n---\n\n'))
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  const handleFinance = async (data: any) => {
    setLoading(true)
    try {
      const response = await api.financeReport(data)
      setResult(response.analysis + '\n\nРекомендации:\n' + response.recommendations.join('\n'))
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  const handleSummary = async (data: any) => {
    setLoading(true)
    try {
      const response = await api.summary(data)
      setResult(response.summary + '\n\nЗадачи:\n' + response.tasks.join('\n'))
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  const handleCompany = async (data: any) => {
    setLoading(true)
    try {
      const response = await api.companyCard(data)
      setResult(response.card_text + '\n\nРекомендации:\n' + response.recommendations.join('\n'))
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  const handleTaxes = async (data: any) => {
    setLoading(true)
    try {
      const requestData = {
        ...data,
        revenue: data.revenue ? parseFloat(data.revenue) : undefined
      }
      const response = await api.taxConsultation(requestData)
      setResult(response.answer + '\n\n' + response.warnings.join('\n'))
      setActiveModal(null)
    } catch (err: any) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="quick-actions">
        <h3>Быстрые действия</h3>
        <div className="actions-grid">
          {actions.map((action) => (
            <button
              key={action.id}
              className="action-button"
              onClick={() => setActiveModal(action.id)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeModal === 'contract' && (
        <ContractModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleContract}
          loading={loading}
        />
      )}

      {activeModal === 'post' && (
        <PostModal
          onClose={() => setActiveModal(null)}
          onSubmit={handlePost}
          loading={loading}
        />
      )}

      {activeModal === 'finance' && (
        <FinanceModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleFinance}
          loading={loading}
        />
      )}

      {activeModal === 'summary' && (
        <SummaryModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleSummary}
          loading={loading}
        />
      )}

      {activeModal === 'company' && (
        <CompanyModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCompany}
          loading={loading}
        />
      )}

      {activeModal === 'taxes' && (
        <TaxesModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleTaxes}
          loading={loading}
        />
      )}

      {result && (
        <ResultModal
          result={result}
          onClose={() => setResult(null)}
        />
      )}
    </>
  )
}

interface ModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
  loading: boolean
}

const ContractModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [form, setForm] = useState({
    contract_type: '',
    parties: '',
    subject: '',
    amount: '',
    additional_info: '',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Составить договор</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
          <input
            placeholder="Тип договора (аренда, услуги, поставка...)"
            value={form.contract_type}
            onChange={(e) => setForm({ ...form, contract_type: e.target.value })}
            required
          />
          <input
            placeholder="Стороны договора"
            value={form.parties}
            onChange={(e) => setForm({ ...form, parties: e.target.value })}
            required
          />
          <textarea
            placeholder="Предмет договора"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            rows={3}
          />
          <input
            placeholder="Сумма/цена (опционально)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <textarea
            placeholder="Дополнительная информация"
            value={form.additional_info}
            onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
            rows={2}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Генерация...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const PostModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [form, setForm] = useState({
    business_description: '',
    promotion_goal: '',
    platform: 'general',
    target_audience: '',
    tone: 'friendly',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Создать промо-пост</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
          <textarea
            placeholder="Описание бизнеса"
            value={form.business_description}
            onChange={(e) => setForm({ ...form, business_description: e.target.value })}
            required
            rows={3}
          />
          <textarea
            placeholder="Цель промоакции"
            value={form.promotion_goal}
            onChange={(e) => setForm({ ...form, promotion_goal: e.target.value })}
            required
            rows={2}
          />
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          >
            <option value="general">Общая</option>
            <option value="instagram">Instagram</option>
            <option value="vk">ВКонтакте</option>
            <option value="telegram">Telegram</option>
          </select>
          <input
            placeholder="Целевая аудитория (опционально)"
            value={form.target_audience}
            onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Генерация...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const FinanceModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [form, setForm] = useState({
    sales_data: '',
    expenses_data: '',
    period: '',
    questions: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: any = {}
    if (form.sales_data) {
      try {
        data.sales_data = JSON.parse(form.sales_data)
      } catch {
        data.sales_data = { description: form.sales_data }
      }
    }
    if (form.expenses_data) {
      try {
        data.expenses_data = JSON.parse(form.expenses_data)
      } catch {
        data.expenses_data = { description: form.expenses_data }
      }
    }
    if (form.period) data.period = form.period
    if (form.questions) data.questions = form.questions
    onSubmit(data)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Финансовый отчёт</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Данные по продажам (JSON или текст)"
            value={form.sales_data}
            onChange={(e) => setForm({ ...form, sales_data: e.target.value })}
            rows={3}
          />
          <textarea
            placeholder="Данные по расходам (JSON или текст)"
            value={form.expenses_data}
            onChange={(e) => setForm({ ...form, expenses_data: e.target.value })}
            rows={3}
          />
          <input
            placeholder="Период (опционально)"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
          />
          <textarea
            placeholder="Конкретные вопросы (опционально)"
            value={form.questions}
            onChange={(e) => setForm({ ...form, questions: e.target.value })}
            rows={2}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Анализ...' : 'Проанализировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SummaryModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [text, setText] = useState('')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Резюме текста</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ text }) }}>
          <textarea
            placeholder="Вставьте текст для резюмирования..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={10}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading || !text.trim()}>
              {loading ? 'Обработка...' : 'Резюмировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ResultModalProps {
  result: string
  onClose: () => void
}

const ResultModal = ({ result, onClose }: ResultModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <h3>Результат</h3>
        <div className="result-content">
          <pre>{result}</pre>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}

const CompanyModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [form, setForm] = useState({
    inn: '',
    company_name: '',
    address: '',
    additional_info: '',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Карточка компании</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
          <input
            placeholder="ИНН (опционально)"
            value={form.inn}
            onChange={(e) => setForm({ ...form, inn: e.target.value })}
          />
          <input
            placeholder="Название компании"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
          <input
            placeholder="Адрес (опционально)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <textarea
            placeholder="Дополнительная информация (ОКВЭД, вид деятельности, контакты и т.д.)"
            value={form.additional_info}
            onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
            rows={4}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading || !form.company_name.trim()}>
              {loading ? 'Создание...' : 'Создать карточку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const TaxesModal = ({ onClose, onSubmit, loading }: ModalProps) => {
  const [form, setForm] = useState({
    question: '',
    business_type: '',
    tax_regime: '',
    revenue: '',
    additional_context: '',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Консультация по налогам</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
          <textarea
            placeholder="Ваш вопрос о налогах"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
            rows={3}
          />
          <select
            value={form.business_type}
            onChange={(e) => setForm({ ...form, business_type: e.target.value })}
          >
            <option value="">Тип бизнеса (опционально)</option>
            <option value="ИП">ИП</option>
            <option value="ООО">ООО</option>
          </select>
          <select
            value={form.tax_regime}
            onChange={(e) => setForm({ ...form, tax_regime: e.target.value })}
          >
            <option value="">Налоговый режим (опционально)</option>
            <option value="УСН">УСН</option>
            <option value="ОСН">ОСН</option>
            <option value="ПСН">ПСН</option>
            <option value="ЕНВД">ЕНВД</option>
          </select>
          <input
            type="number"
            placeholder="Выручка в рублях (опционально, для расчётов)"
            value={form.revenue}
            onChange={(e) => setForm({ ...form, revenue: e.target.value })}
          />
          <textarea
            placeholder="Дополнительный контекст (опционально)"
            value={form.additional_context}
            onChange={(e) => setForm({ ...form, additional_context: e.target.value })}
            rows={2}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading || !form.question.trim()}>
              {loading ? 'Получение ответа...' : 'Получить консультацию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickActions

