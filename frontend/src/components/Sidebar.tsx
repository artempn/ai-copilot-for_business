// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import './Sidebar.css'

interface SidebarProps {
  selectedMode: string
  onModeSelect: (mode: string) => void
}

const modes = [
  { id: 'general', label: 'Общий', icon: '💬' },
  { id: 'legal', label: 'Юридический', icon: '⚖️' },
  { id: 'marketing', label: 'Маркетинг', icon: '📢' },
  { id: 'finance', label: 'Финансы', icon: '💰' },
  { id: 'summary', label: 'Резюме', icon: '📝' },
]

const Sidebar = ({ selectedMode, onModeSelect }: SidebarProps) => {
  return (
    <div className="sidebar">
      <h2>Режимы работы</h2>
      <div className="mode-list">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-button ${selectedMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeSelect(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-label">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar

