import { useState } from 'react'
import { getCurrentUser, updateCurrentUserProfile, clearAuthSession } from '../services/authUtils.js'
import { atualizarPerfil } from '../services/api.js'
import { useLanguage } from '../i18n/languageStore.js'

const getFormData = (currentUser) => ({
  fullName: currentUser?.fullName || '',
  username: currentUser?.username || '',
  email: currentUser?.email || '',
  phone: currentUser?.phone || '',
  address: currentUser?.address || '',
})

function Perfil({ onLoginClick }) {
  const { t } = useLanguage()
  const [user, setUser] = useState(() => getCurrentUser())
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(() => getFormData(getCurrentUser()))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const response = await atualizarPerfil(formData)
      const updatedUser = updateCurrentUserProfile(response.user)

      if (updatedUser) {
        setUser(updatedUser)
        setFormData(getFormData(updatedUser))
        setIsEditing(false)
        setMessage(t('perfil.perfilAtualizado'))
        return
      }
    } catch {
      // A mensagem de erro mais amigavel fica abaixo.
    }

    setMessage(t('perfil.erroAtualizarPerfil'))
  }

  const handleLogout = () => {
    clearAuthSession()
    if (onLoginClick) {
      onLoginClick()
    }
  }

  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-card" role="region" aria-label="Perfil do usuário">
          <h2>{t('perfil.semLoginTitulo')}</h2>
          <p className="profile-subtitle">{t('perfil.semLoginTexto')}</p>
          <div className="profile-actions">
            <button className="profile-primary" onClick={() => onLoginClick && onLoginClick()}>{t('perfil.irParaLogin')}</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <section className="profile-card" role="region" aria-label="Perfil do usuário">
        <header className="profile-header">
          <div className="profile-identity">
            <div className="profile-avatar">{(user.fullName || user.username || user.email || 'C').slice(0, 1).toUpperCase()}</div>
            <div>
              <p className="profile-eyebrow">{t('perfil.minhaConta')}</p>
              <h2>{t('perfil.ola', { nome: user.fullName || user.username || user.email })}</h2>
              <p className="profile-subtitle">{t('perfil.subtitulo')}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="profile-primary" onClick={handleLogout}>
              {t('perfil.sair')}
            </button>
          </div>
        </header>

        {message && <p className="profile-message">{message}</p>}

        <div className="profile-highlight-row">
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">{t('perfil.statusConta')}</p>
            <strong>{t('perfil.contaAtiva')}</strong>
            <span>{t('perfil.contaAtivaTexto')}</span>
          </article>
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">{t('perfil.proximoPasso')}</p>
            <strong>{t('perfil.atualizeDados')}</strong>
            <span>{t('perfil.atualizeDadosTexto')}</span>
          </article>
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">{t('perfil.seguranca')}</p>
            <strong>{t('perfil.protecaoReforcada')}</strong>
            <span>{t('perfil.protecaoReforcadaTexto')}</span>
          </article>
        </div>

        <div className="profile-grid">
          <article className="profile-panel">
            <div className="profile-panel-header">
              <h3>{t('perfil.dadosPessoais')}</h3>
              <button className="profile-link-button" onClick={() => setIsEditing((prev) => !prev)}>
                {isEditing ? t('perfil.cancelar') : t('perfil.editar')}
              </button>
            </div>

            <form className="profile-form" onSubmit={handleSave}>
              <label className="profile-field">
                <span>{t('perfil.nomeCompleto')}</span>
                {isEditing ? (
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.fullName || t('perfil.naoInformado')}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>{t('perfil.usuario')}</span>
                {isEditing ? (
                  <input name="username" value={formData.username} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.username || t('perfil.naoInformado')}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>{t('perfil.email')}</span>
                {isEditing ? (
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.email}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>{t('perfil.telefone')}</span>
                {isEditing ? (
                  <input name="phone" value={formData.phone} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.phone || t('perfil.naoInformado')}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>{t('perfil.endereco')}</span>
                {isEditing ? (
                  <input name="address" value={formData.address} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.address || t('perfil.naoInformado')}</strong>
                )}
              </label>

              {isEditing && (
                <button className="profile-primary" type="submit">
                  {t('perfil.salvarAlteracoes')}
                </button>
              )}
            </form>
          </article>

          <article className="profile-panel profile-panel-secondary">
            <h3>{t('perfil.resumoConta')}</h3>
            <p className="profile-highlight">{t('perfil.cadastroAtualizado')}</p>
            <p>{t('perfil.resumoTexto')}</p>
            <ul className="profile-info-list">
              <li><span>{t('perfil.loginSeguro')}</span><strong>{t('perfil.ativo')}</strong></li>
              <li><span>{t('perfil.dadosAtualizados')}</span><strong>{t('perfil.disponivel')}</strong></li>
              <li><span>{t('perfil.acessoRapido')}</span><strong>{t('perfil.pronto')}</strong></li>
            </ul>
            <div className="profile-pill-group">
              <span className="profile-pill">{t('perfil.pillAtualizacao')}</span>
              <span className="profile-pill">{t('perfil.pillInformacoes')}</span>
              <span className="profile-pill">{t('perfil.pillAtendimento')}</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Perfil
