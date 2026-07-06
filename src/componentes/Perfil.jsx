import { useEffect, useState } from 'react'
import { getCurrentUser, updateCurrentUserProfile, clearAuthSession } from '../services/authUtils.js'

function Perfil({ onHomeClick, onLoginClick }) {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    const updatedUser = updateCurrentUserProfile(formData)

    if (updatedUser) {
      setUser(updatedUser)
      setIsEditing(false)
      setMessage('Perfil atualizado com sucesso!')
    } else {
      setMessage('Não foi possível atualizar o perfil neste momento.')
    }
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
          <h2>Você ainda não fez login.</h2>
          <p className="profile-subtitle">Entre para acessar seu perfil e editar seus dados.</p>
          <div className="profile-actions">
            <button className="profile-primary" onClick={() => onLoginClick && onLoginClick()}>Ir para login</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <section className="profile-card" role="region" aria-label="Perfil do usuário">
        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">Minha conta</p>
            <h2>Olá, {user.fullName || user.username || user.email}</h2>
            <p className="profile-subtitle">Atualize suas informações e mantenha seus dados sempre organizados.</p>
          </div>
          <div className="profile-actions">
            <button className="profile-secondary" onClick={() => onHomeClick && onHomeClick()}>
              Voltar para a página inicial
            </button>
            <button className="profile-primary" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {message && <p className="profile-message">{message}</p>}

        <div className="profile-grid">
          <article className="profile-panel">
            <div className="profile-panel-header">
              <h3>Dados pessoais</h3>
              <button className="profile-link-button" onClick={() => setIsEditing((prev) => !prev)}>
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <form className="profile-form" onSubmit={handleSave}>
              <label className="profile-field">
                <span>Nome completo</span>
                {isEditing ? (
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.fullName || 'Não informado'}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>Usuário</span>
                {isEditing ? (
                  <input name="username" value={formData.username} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.username || 'Não informado'}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>E-mail</span>
                {isEditing ? (
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.email}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>Telefone</span>
                {isEditing ? (
                  <input name="phone" value={formData.phone} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.phone || 'Não informado'}</strong>
                )}
              </label>

              <label className="profile-field">
                <span>Endereço</span>
                {isEditing ? (
                  <input name="address" value={formData.address} onChange={handleChange} className="profile-input" />
                ) : (
                  <strong>{user.address || 'Não informado'}</strong>
                )}
              </label>

              {isEditing && (
                <button className="profile-primary" type="submit">
                  Salvar alterações
                </button>
              )}
            </form>
          </article>

          <article className="profile-panel">
            <h3>Resumo da conta</h3>
            <p className="profile-highlight">Status: Conta ativa</p>
            <p>Você pode revisar, editar e manter seus dados atualizados a qualquer momento.</p>
            <div className="profile-pill-group">
              <span className="profile-pill">Login seguro</span>
              <span className="profile-pill">Dados atualizados</span>
              <span className="profile-pill">Acesso rápido</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Perfil
