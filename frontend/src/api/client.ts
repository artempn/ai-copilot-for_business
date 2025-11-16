// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ChatRequest {
  message: string
  mode: string
  conversation_id?: number | null
}

export interface ChatResponse {
  conversation_id: number
  answer: string
  messages: Array<{
    id: number
    role: string
    content: string
    mode: string | null
    created_at: string
  }>
}

export interface LegalContractRequest {
  contract_type: string
  parties: string
  subject: string
  amount?: string
  additional_info?: string
}

export interface MarketingPostRequest {
  business_description: string
  promotion_goal: string
  platform: string
  target_audience?: string
  tone?: string
}

export interface FinanceReportRequest {
  sales_data?: Record<string, any>
  expenses_data?: Record<string, any>
  period?: string
  questions?: string
}

export interface SummaryRequest {
  text: string
  summary_type?: string
}

export interface CompanyCardRequest {
  inn?: string
  company_name?: string
  address?: string
  additional_info?: string
}

export interface TaxConsultationRequest {
  question: string
  business_type?: string
  tax_regime?: string
  revenue?: number
  additional_context?: string
}

export const api = {
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/api/chat', request)
    return response.data
  },
  
  legalContract: async (request: LegalContractRequest) => {
    const response = await apiClient.post('/api/usecases/legal-contract', request)
    return response.data
  },
  
  marketingPost: async (request: MarketingPostRequest) => {
    const response = await apiClient.post('/api/usecases/marketing-post', request)
    return response.data
  },
  
  financeReport: async (request: FinanceReportRequest) => {
    const response = await apiClient.post('/api/usecases/finance-report', request)
    return response.data
  },
  
  summary: async (request: SummaryRequest) => {
    const response = await apiClient.post('/api/usecases/summary', request)
    return response.data
  },
  
  companyCard: async (request: CompanyCardRequest) => {
    const response = await apiClient.post('/api/usecases/company-card', request)
    return response.data
  },
  
  taxConsultation: async (request: TaxConsultationRequest) => {
    const response = await apiClient.post('/api/usecases/tax-consultation', request)
    return response.data
  },
  
  health: async () => {
    const response = await apiClient.get('/api/health')
    return response.data
  },
}

export default apiClient

