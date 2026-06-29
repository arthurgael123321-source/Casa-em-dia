import { useState } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import { login as apiLogin } from '../services/api'
import googleIcon from '../assets/OIP.png'
import fbIcon from '../assets/pngtree-facebook-logo-facebook-icon-png-image_3654755.png'

export default function Login({ onGuestAccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateAccount = () => {
    setError('')
    setInfo('Criar conta ainda não está disponível, mas você pode entrar sem conta por enquanto.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Por favor preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      const res = await apiLogin(email, password)
      localStorage.setItem('authToken', res.token)
      localStorage.setItem('userEmail', res.email)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login">
        <div className="login-left">
          <div className="logo-wrap">
            <img src={logo} alt="Casa em Dia" className="login-logo" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              id="email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <input
              id="password"
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              minLength={4}
            />

            <div className="login-checks">
              <label><input type="checkbox" /> Aceite os termos de serviço</label>
              <label><input type="checkbox" /> Lembre de mim</label>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-submit-row">
              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="login-alt-actions">
              <button
                type="button"
                className="login-secondary"
                onClick={() => {
                  setError('')
                  setInfo('')
                  if (onGuestAccess) {
                    onGuestAccess()
                  } else {
                    setInfo('Entrar sem conta ativado.')
                  }
                }}
              >
                Entrar sem conta
              </button>
              <button
                type="button"
                className="login-tertiary"
                onClick={handleCreateAccount}
              >
                Criar uma conta
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}
            {info && <div className="login-info">{info}</div>}

            <div className="social-area">
              <div className="social-title">Entrar com</div>
              <div className="social-buttons">
                <button type="button" className="social-btn google" aria-label="e">
                  <img src={googleIcon} alt="Google" className="social-icon" />
                  <span className="social-text"></span>
                </button>
                <button type="button" className="social-btn facebook" aria-label="">
                  <img src={fbIcon} alt="Facebook" className="social-icon" />
                  <span className="social-text white"></span>
                </button>
                <button type="button" className="social-btn phone" aria-label="">📱
                  <span className="social-text"></span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <aside className="login-right" aria-hidden="true">
          <div className="login-bubble-group" aria-hidden="true">
            <span className="bubble bubble-1" />
            <span className="bubble bubble-2" />
            <span className="bubble bubble-3" />
          </div>
          <div className="side-content">
            <h3 className="side-title">Casa em Dia</h3>
            <p className="side-sub">Organização • Limpeza • Manutenção</p>

            <ul className="side-list">
              <li>Profissionais treinados e confiáveis</li>
              <li>Agendamento flexível</li>
              <li>Produtos e equipamentos de qualidade</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
