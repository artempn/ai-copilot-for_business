// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import { useState, useRef, useEffect } from 'react'
import { api, ChatRequest } from '../api/client'
import './Chat.css'

interface ChatProps {
  mode: string
  conversationId: number | null
  onConversationChange: (id: number | null) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const Chat = ({ mode, conversationId, onConversationChange }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const request: ChatRequest = {
        message: userMessage.content,
        mode: mode,
        conversation_id: conversationId,
      }

      const response = await api.chat(request)
      
      if (response.conversation_id && !conversationId) {
        onConversationChange(response.conversation_id)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при отправке сообщения')
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Чат с ИИ-помощником</h3>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Начните диалог с ИИ-помощником</p>
            <p className="chat-hint">Задайте любой вопрос о вашем бизнесе</p>
            <div className="chat-suggestions">
              <p>Примеры вопросов:</p>
              <ul>
                <li>Как выбрать налоговый режим для ИП?</li>
                <li>Составь договор аренды офиса</li>
                <li>Создай пост для Instagram о новой услуге</li>
                <li>Проанализируй мои продажи за месяц</li>
              </ul>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="message error">
            <div className="message-content">
              ⚠️ {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваш вопрос..."
          rows={2}
          disabled={loading}
        />
        <button
          className="chat-send-button"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  )
}

export default Chat

