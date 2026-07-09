import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/authUtils.js'
import './Configuracoes.css'
import bellIcon from '../assets/icons/Notificação.png'
import lockIcon from '../assets/icons/Cadeado.png'
import settingsIcon from '../assets/configs.png'
import shieldIcon from '../assets/icons/Segurança.png'

export default function Configuracoes({ onHomeClick, onLoginClick }) {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('notificacoes')
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    notificacoes: {
      emailNotificacoes: true,
      smsNotificacoes: false,
      notificacoesAgendamento: true,
      notificacoesPromotos: false,
    },
    privacidade: {
      perfPublico: false,
      mostrarTelefone: true,
    },
    preferencias: {
      idioma: 'pt-BR',
      tema: 'claro',
    },
    seguranca: {
      sessoesAtivasMonitor: true,
    },
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [])

  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }))
  }

  const handleSelectChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    try {
      const userSettings = {
        ...settings,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem('userSettings', JSON.stringify(userSettings))
      setMessageType('success')
      setMessage('✓ Configurações salvas com sucesso!')
    } catch (error) {
      setMessageType('error')
      setMessage('❌ Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(''), 4000)
    }
  }

  if (!user) {
    return (
      <main className="settings-page">
        <section className="settings-container">
          <div className="settings-empty">
            <h2>Acesso restrito</h2>
            <p>Você precisa estar autenticado para acessar as configurações.</p>
            <button className="btn-primary" onClick={() => onLoginClick && onLoginClick()}>
              Ir para login
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <header className="settings-header">
          <div className="settings-header-content">
            <h1>Configurações</h1>
            <p className="settings-subtitle">Personalize sua experiência</p>
          </div>
          <button className="btn-back" onClick={() => onHomeClick && onHomeClick()}>
            ← Voltar
          </button>
        </header>

        {/* Mensagem */}
        {message && (
          <div className={`settings-message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="settings-layout">
          {/* Sidebar */}
          <aside className="settings-sidebar">
  <nav className="settings-nav">
    <button
      className={`nav-item ${activeTab === 'notificacoes' ? 'active' : ''}`}
      onClick={() => setActiveTab('notificacoes')}
    >
      <img src={bellIcon} alt="" className="nav-icon" />
      Notificações
    </button>

    <button
      className={`nav-item ${activeTab === 'privacidade' ? 'active' : ''}`}
      onClick={() => setActiveTab('privacidade')}
    >
      <img src={lockIcon} alt="" className="nav-icon" />
      Privacidade
    </button>

    <button
      className={`nav-item ${activeTab === 'preferencias' ? 'active' : ''}`}
      onClick={() => setActiveTab('preferencias')}
    >
      <img src={settingsIcon} alt="" className="nav-icon" />
      Preferências
    </button>

    <button
      className={`nav-item ${activeTab === 'seguranca' ? 'active' : ''}`}
      onClick={() => setActiveTab('seguranca')}
    >
      <img src={shieldIcon} alt="" className="nav-icon" />
      Segurança
    </button>
  </nav>
</aside>

          {/* Content */}
          <section className="settings-content">
            {/* Notificações */}
            {activeTab === 'notificacoes' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Notificações</h2>
                  <p>Escolha como deseja ser notificado</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Notificações por Email</h3>
                      <p>Receba atualizações importantes</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notificacoes.emailNotificacoes}
                        onChange={() => handleToggle('notificacoes', 'emailNotificacoes')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Notificações por SMS</h3>
                      <p>Receba lembretes via SMS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notificacoes.smsNotificacoes}
                        onChange={() => handleToggle('notificacoes', 'smsNotificacoes')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Notificações de Agendamento</h3>
                      <p>Confirmações de seus agendamentos</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notificacoes.notificacoesAgendamento}
                        onChange={() => handleToggle('notificacoes', 'notificacoesAgendamento')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Notificações de Promoções</h3>
                      <p>Ofertas e promoções especiais</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notificacoes.notificacoesPromotos}
                        onChange={() => handleToggle('notificacoes', 'notificacoesPromotos')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacidade */}
            {activeTab === 'privacidade' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Privacidade</h2>
                  <p>Controle quem vê suas informações</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Perfil Público</h3>
                      <p>Permita que outros vejam seu perfil</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.privacidade.perfPublico}
                        onChange={() => handleToggle('privacidade', 'perfPublico')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Mostrar Telefone</h3>
                      <p>Profissionais podem ver seu telefone</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.privacidade.mostrarTelefone}
                        onChange={() => handleToggle('privacidade', 'mostrarTelefone')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Preferências */}
            {activeTab === 'preferencias' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Preferências</h2>
                  <p>Customize sua experiência</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Idioma</h3>
                      <p>Escolha o idioma da plataforma</p>
                    </div>
                    <select
                      value={settings.preferencias.idioma}
                      onChange={(e) => handleSelectChange('preferencias', 'idioma', e.target.value)}
                      className="settings-select"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Tema</h3>
                      <p>Escolha como a interface aparece</p>
                    </div>
                    <select
                      value={settings.preferencias.tema}
                      onChange={(e) => handleSelectChange('preferencias', 'tema', e.target.value)}
                      className="settings-select"
                    >
                      <option value="claro">Claro</option>
                      <option value="escuro">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            {activeTab === 'seguranca' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Segurança</h2>
                  <p>Proteja sua conta</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Monitorar Sessões</h3>
                      <p>Receba alertas sobre novos acessos</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.seguranca.sessoesAtivasMonitor}
                        onChange={() => handleToggle('seguranca', 'sessoesAtivasMonitor')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-info-message">
                    <p>💡 Mais opções de segurança disponíveis em breve.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão Salvar */}
            <div className="settings-actions">
              <button 
                className="btn-primary" 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? '⏳ Salvando...' : ' Salvar Configurações'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
