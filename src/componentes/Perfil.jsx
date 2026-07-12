import { useState } from 'react'
import { getCurrentUser, updateCurrentUserProfile, clearAuthSession } from '../services/authUtils.js'
import { atualizarPerfil } from '../services/api.js'

const getFormData = (currentUser) => ({
  fullName: currentUser?.fullName || '',
  username: currentUser?.username || '',
  email: currentUser?.email || '',
  phone: currentUser?.phone || '',
  address: currentUser?.address || '',
})

function Perfil({ onLoginClick }) {
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
        setMessage('Perfil atualizado com sucesso!')
        return
      }
    } catch {
      // A mensagem de erro mais amigavel fica abaixo.
    }

    setMessage('Nao foi possivel atualizar o perfil neste momento.')
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
          <div className="profile-identity">
            <div className="profile-avatar">{(user.fullName || user.username || user.email || 'C').slice(0, 1).toUpperCase()}</div>
            <div>
              <p className="profile-eyebrow">Minha conta</p>
              <h2>Olá, {user.fullName || user.username || user.email}</h2>
              <p className="profile-subtitle">Seu espaço para manter dados, preferências e histórico sempre em dia.</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="profile-primary" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {message && <p className="profile-message">{message}</p>}

        <div className="profile-highlight-row">
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">Status da conta</p>
            <strong>Conta ativa</strong>
            <span>Seu perfil está pronto para receber novos agendamentos.</span>
          </article>
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">Próximo passo</p>
            <strong>Atualize seus dados</strong>
            <span>Deixe seu cadastro completo e preparado para qualquer serviço.</span>
          </article>
          <article className="profile-highlight-card">
            <p className="profile-highlight-title">Segurança</p>
            <strong>Proteção reforçada</strong>
            <span>Seu acesso fica seguro e organizado em um só lugar.</span>
          </article>
        </div>

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

          <article className="profile-panel profile-panel-secondary">
            <h3>Resumo da conta</h3>
            <p className="profile-highlight">Seu cadastro está sempre atualizado.</p>
            <p>Organize seus dados, mantenha o atendimento mais rápido e tenha mais praticidade para agendar cada serviço.</p>
            <ul className="profile-info-list">
              <li><span>Login seguro</span><strong>Ativo</strong></li>
              <li><span>Dados atualizados</span><strong>Disponível</strong></li>
              <li><span>Acesso rápido</span><strong>Pronto</strong></li>
            </ul>
            <div className="profile-pill-group">
              <span className="profile-pill">Atualização simples</span>
              <span className="profile-pill">Informações seguras</span>
              <span className="profile-pill">Atendimento melhor</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Perfil
