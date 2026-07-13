import { useState } from 'react'
import { getCurrentUser, updateCurrentUserProfile } from '../services/authUtils.js'
import { useLanguage } from '../i18n/languageStore.js'
import { getStoredTheme, setTheme } from '../services/theme.js'
import './Configuracoes.css'
import bellIcon from '../assets/Icons/Notificação.png'
import lockIcon from '../assets/Icons/Cadeado.png'
import settingsIcon from '../assets/configs.png'
import shieldIcon from '../assets/Icons/Segurança.png'

export default function Configuracoes({ onHomeClick, onLoginClick }) {
  const { t, language, setLanguage } = useLanguage()
  const [user, setUser] = useState(() => getCurrentUser())
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('notificacoes')
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings')
    let parsed = null

    if (savedSettings) {
      try {
        parsed = JSON.parse(savedSettings)
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
      ...parsed?.notificacoes,
    },
    privacidade: {
      perfPublico: false,
      mostrarTelefone: true,
      ...parsed?.privacidade,
    },
    preferencias: {
      ...parsed?.preferencias,
      idioma: language,
      tema: getStoredTheme(),
    },
    seguranca: {
      sessoesAtivasMonitor: true,
      ...parsed?.seguranca,
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

    if (section === 'preferencias' && key === 'tema') {
      setTheme(value)
    }

    if (section === 'preferencias' && key === 'idioma') {
      setLanguage(value)
    }
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
      setMessage(t('configuracoes.configSalvas'))
    } catch {
      setMessageType('error')
      setMessage(t('configuracoes.erroSalvarConfig'))
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
      showMessage('error', t('configuracoes.erroCriarSenha'))
      return
    }

    const updatedUser = updateCurrentUserProfile({ loginPreference })
    setUser(updatedUser)
    localStorage.setItem('preferredLoginMethod', loginPreference)
    showMessage('success', t('configuracoes.preferenciaAtualizada'))
  }

  const handlePasswordChange = (event) => {
    event.preventDefault()
    const hadPassword = Boolean(user.password)

    if (user.password && currentPassword !== user.password) {
      showMessage('error', t('configuracoes.senhaAtualIncorreta'))
      return
    }

    if (newPassword.length < 6) {
      showMessage('error', t('configuracoes.novaSenhaCurta'))
      return
    }

    if (newPassword !== confirmNewPassword) {
      showMessage('error', t('configuracoes.confirmacaoNaoConfere'))
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
    showMessage('success', hadPassword ? t('configuracoes.senhaAlterada') : t('configuracoes.senhaCriada'))
  }

  if (!user) {
    return (
      <main className="settings-page">
        <section className="settings-container">
          <div className="settings-empty">
            <h2>{t('configuracoes.acessoRestrito')}</h2>
            <p>{t('configuracoes.acessoRestritoTexto')}</p>
            <button className="btn-primary" onClick={() => onLoginClick && onLoginClick()}>
              {t('configuracoes.irParaLogin')}
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
            <h1>{t('configuracoes.titulo')}</h1>
            <p className="settings-subtitle">{t('configuracoes.subtitulo')}</p>
          </div>
          <button className="btn-back" onClick={() => onHomeClick && onHomeClick()}>
            {t('configuracoes.voltar')}
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
      {t('configuracoes.navNotificacoes')}
    </button>

    <button
      className={`nav-item ${activeTab === 'privacidade' ? 'active' : ''}`}
      onClick={() => setActiveTab('privacidade')}
    >
      <img src={lockIcon} alt="" className="nav-icon" />
      {t('configuracoes.navPrivacidade')}
    </button>

    <button
      className={`nav-item ${activeTab === 'preferencias' ? 'active' : ''}`}
      onClick={() => setActiveTab('preferencias')}
    >
      <img src={settingsIcon} alt="" className="nav-icon" />
      {t('configuracoes.navPreferencias')}
    </button>

    <button
      className={`nav-item ${activeTab === 'seguranca' ? 'active' : ''}`}
      onClick={() => setActiveTab('seguranca')}
    >
      <img src={shieldIcon} alt="" className="nav-icon" />
      {t('configuracoes.navSeguranca')}
    </button>
  </nav>
</aside>

          {/* Content */}
          <section className="settings-content">
            {/* Notificações */}
            {activeTab === 'notificacoes' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('configuracoes.notificacoesTitulo')}</h2>
                  <p>{t('configuracoes.notificacoesSubtitulo')}</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>{t('configuracoes.notifEmailTitulo')}</h3>
                      <p>{t('configuracoes.notifEmailDesc')}</p>
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
                      <h3>{t('configuracoes.notifSmsTitulo')}</h3>
                      <p>{t('configuracoes.notifSmsDesc')}</p>
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
                      <h3>{t('configuracoes.notifAgendamentoTitulo')}</h3>
                      <p>{t('configuracoes.notifAgendamentoDesc')}</p>
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
                      <h3>{t('configuracoes.notifPromocoesTitulo')}</h3>
                      <p>{t('configuracoes.notifPromocoesDesc')}</p>
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
                  <h2>{t('configuracoes.privacidadeTitulo')}</h2>
                  <p>{t('configuracoes.privacidadeSubtitulo')}</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>{t('configuracoes.perfilPublicoTitulo')}</h3>
                      <p>{t('configuracoes.perfilPublicoDesc')}</p>
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
                      <h3>{t('configuracoes.mostrarTelefoneTitulo')}</h3>
                      <p>{t('configuracoes.mostrarTelefoneDesc')}</p>
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
                  <h2>{t('configuracoes.preferenciasTitulo')}</h2>
                  <p>{t('configuracoes.preferenciasSubtitulo')}</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>{t('configuracoes.idiomaTitulo')}</h3>
                      <p>{t('configuracoes.idiomaDesc')}</p>
                    </div>
                    <select
                      value={settings.preferencias.idioma}
                      onChange={(e) => handleSelectChange('preferencias', 'idioma', e.target.value)}
                      className="settings-select"
                    >
                      <option value="pt-BR">{t('configuracoes.idiomaPtBR')}</option>
                      <option value="en-US">{t('configuracoes.idiomaEnUS')}</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>{t('configuracoes.temaTitulo')}</h3>
                      <p>{t('configuracoes.temaDesc')}</p>
                    </div>
                    <select
                      value={settings.preferencias.tema}
                      onChange={(e) => handleSelectChange('preferencias', 'tema', e.target.value)}
                      className="settings-select"
                    >
                      <option value="claro">{t('configuracoes.temaClaro')}</option>
                      <option value="escuro">{t('configuracoes.temaEscuro')}</option>
                      <option value="auto">{t('configuracoes.temaAutomatico')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            {activeTab === 'seguranca' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('configuracoes.segurancaTitulo')}</h2>
                  <p>{t('configuracoes.segurancaSubtitulo')}</p>
                </div>
                <div className="settings-items">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>{t('configuracoes.monitorarSessoesTitulo')}</h3>
                      <p>{t('configuracoes.monitorarSessoesDesc')}</p>
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
                      <h3>{t('configuracoes.comoDesejaEntrar')}</h3>
                      <p>{t('configuracoes.comoDesejaEntrarDesc')}</p>
                    </div>
                    <div className="login-preference-options" role="radiogroup" aria-label="Método de login preferido">
                      <label className={`login-preference-option ${loginPreference === 'google' ? 'selected' : ''}`}>
                        <input type="radio" name="loginPreference" value="google" checked={loginPreference === 'google'} onChange={(event) => setLoginPreference(event.target.value)} />
                        <span><strong>{t('configuracoes.continuarComGoogle')}</strong><small>{t('configuracoes.continuarComGoogleDesc')}</small></span>
                      </label>
                      <label className={`login-preference-option ${loginPreference === 'email' ? 'selected' : ''}`}>
                        <input type="radio" name="loginPreference" value="email" checked={loginPreference === 'email'} onChange={(event) => setLoginPreference(event.target.value)} />
                        <span><strong>{t('configuracoes.emailSenha')}</strong><small>{t('configuracoes.emailSenhaDesc')}</small></span>
                      </label>
                    </div>
                    <button type="button" className="btn-secondary" onClick={handleLoginPreferenceSave}>{t('configuracoes.salvarPreferenciaLogin')}</button>
                  </div>

                  <form className="security-card password-form" onSubmit={handlePasswordChange}>
                    <div className="setting-info">
                      <h3>{user.password ? t('configuracoes.alterarSenha') : t('configuracoes.criarSenhaTitulo')}</h3>
                      <p>{user.password ? t('configuracoes.alterarSenhaDesc') : t('configuracoes.criarSenhaDesc')}</p>
                    </div>
                    {user.password && (
                      <label className="security-field">{t('configuracoes.senhaAtual')}
                        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required />
                      </label>
                    )}
                    <label className="security-field">{t('configuracoes.novaSenha')}
                      <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength="6" required />
                    </label>
                    <label className="security-field">{t('configuracoes.confirmarNovaSenha')}
                      <input type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} autoComplete="new-password" minLength="6" required />
                    </label>
                    <button type="submit" className="btn-secondary">{user.password ? t('configuracoes.alterarSenha') : t('configuracoes.criarSenha')}</button>
                  </form>

                  <div className="setting-info-message">
                    <p>{t('configuracoes.maisSeguranca')}</p>
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
                {isSaving ? t('configuracoes.salvando') : t('configuracoes.salvarConfiguracoes')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
