import { useState } from 'react'
import { getCurrentUser, updateCurrentUserProfile } from '../services/authUtils.js'
import './Configuracoes.css'
import bellIcon from '../assets/Icons/Notificação.png'
import lockIcon from '../assets/Icons/Cadeado.png'
import settingsIcon from '../assets/configs.png'
import shieldIcon from '../assets/Icons/Segurança.png'

export default function Configuracoes({ onHomeClick, onLoginClick }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('notificacoes')
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings)
      } catch {
        localStorage.removeItem('userSettings')
      }
    }

    return {
    notificacoes: {
      emailNotificacoes: true,
      smsNotificacoes: false,
      notificacoesAgendamento: true,
      notificacoesPromocoes: false,
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
    }
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loginPreference, setLoginPreference] = useState(() => user?.loginPreference || user?.loginMethod || 'email')

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
    } catch {
      setMessageType('error')
      setMessage('❌ Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(''), 4000)
    }
  }

  const showMessage = (type, text) => {
    setMessageType(type)
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleLoginPreferenceSave = () => {
    if (loginPreference === 'email' && !user.password) {
      showMessage('error', 'Crie uma senha antes de escolher o acesso por e-mail e senha.')
      return
    }

    const updatedUser = updateCurrentUserProfile({ loginPreference })
    setUser(updatedUser)
    localStorage.setItem('preferredLoginMethod', loginPreference)
    showMessage('success', 'Preferência de login atualizada com sucesso!')
  }

  const handlePasswordChange = (event) => {
    event.preventDefault()
    const hadPassword = Boolean(user.password)

    if (user.password && currentPassword !== user.password) {
      showMessage('error', 'A senha atual está incorreta.')
      return
    }

    if (newPassword.length < 6) {
      showMessage('error', 'A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      showMessage('error', 'A confirmação da nova senha não confere.')
      return
    }

    const updatedUser = updateCurrentUserProfile({
      password: newPassword,
      ...(hadPassword ? {} : { loginPreference: 'email' }),
    })
    setUser(updatedUser)
    if (!hadPassword) {
      setLoginPreference('email')
      localStorage.setItem('preferredLoginMethod', 'email')
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    showMessage('success', hadPassword ? 'Senha alterada com sucesso!' : 'Senha criada com sucesso. Você já pode entrar por e-mail e senha.')
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
                        checked={settings.notificacoes.notificacoesPromocoes}
                        onChange={() => handleToggle('notificacoes', 'notificacoesPromocoes')}
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

                  <div className="security-card">
                    <div className="setting-info">
                      <h3>Como deseja entrar</h3>
                      <p>Escolha o método que será priorizado no próximo acesso.</p>
                    </div>
                    <div className="login-preference-options" role="radiogroup" aria-label="Método de login preferido">
                      <label className={`login-preference-option ${loginPreference === 'google' ? 'selected' : ''}`}>
                        <input type="radio" name="loginPreference" value="google" checked={loginPreference === 'google'} onChange={(event) => setLoginPreference(event.target.value)} />
                        <span><strong>Continuar com Google</strong><small>Use a verificação da sua conta Google.</small></span>
                      </label>
                      <label className={`login-preference-option ${loginPreference === 'email' ? 'selected' : ''}`}>
                        <input type="radio" name="loginPreference" value="email" checked={loginPreference === 'email'} onChange={(event) => setLoginPreference(event.target.value)} />
                        <span><strong>E-mail e senha</strong><small>Entre usando o e-mail cadastrado e sua senha.</small></span>
                      </label>
                    </div>
                    <button type="button" className="btn-secondary" onClick={handleLoginPreferenceSave}>Salvar preferência de login</button>
                  </div>

                  <form className="security-card password-form" onSubmit={handlePasswordChange}>
                    <div className="setting-info">
                      <h3>{user.password ? 'Alterar senha' : 'Criar senha para acesso por e-mail'}</h3>
                      <p>{user.password ? 'Confirme sua senha atual para definir uma nova.' : 'Sua conta foi criada com Google. Defina uma senha para também poder entrar por e-mail.'}</p>
                    </div>
                    {user.password && (
                      <label className="security-field">Senha atual
                        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required />
                      </label>
                    )}
                    <label className="security-field">Nova senha
                      <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength="6" required />
                    </label>
                    <label className="security-field">Confirmar nova senha
                      <input type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} autoComplete="new-password" minLength="6" required />
                    </label>
                    <button type="submit" className="btn-secondary">{user.password ? 'Alterar senha' : 'Criar senha'}</button>
                  </form>
                    
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
