// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import { useState } from 'react'
import Chat from './components/Chat'
import QuickActions from './components/QuickActions'
import './App.css'

function App() {
  const [conversationId, setConversationId] = useState<number | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Copilot для Малого Бизнеса</h1>
        <p>Ваш помощник в решении бизнес-задач</p>
      </header>
      <div className="app-container">
        <div className="main-content">
          <QuickActions 
            onActionComplete={() => {}}
          />
          <Chat 
            mode="general"
            conversationId={conversationId}
            onConversationChange={setConversationId}
          />
        </div>
      </div>
    </div>
  )
}

export default App

