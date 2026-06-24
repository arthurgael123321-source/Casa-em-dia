import { useState } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import { login as apiLogin } from '../services/api'
import googleIcon from '../assets/OIP.png'
import fbIcon from '../assets/pngtree-facebook-logo-facebook-icon-png-image_3654755.png'

export default function Login({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {onBack && (
                <button
                  type="button"
                  className="login-submit"
                  onClick={() => onBack()}
                  style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                >
                  Voltar
                </button>
              )}

              <button className="login-submit" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            </div>

            <div className="social-area">
              <div className="social-title">/Entrar com</div>
              <div className="social-buttons">
                <button type="button" className="social-btn google" aria-label="Entrar com Google">
                  <img src={googleIcon} alt="Google" className="social-icon" />
                  <span className="social-text">Entrar com Google</span>
                </button>
                <button type="button" className="social-btn facebook" aria-label="Entrar com Facebook">
                  <img src={fbIcon} alt="Facebook" className="social-icon" />
                  <span className="social-text white">Entrar com Facebook</span>
                </button>
                <button type="button" className="social-btn phone" aria-label="Entrar com Telefone">📱
                  <span className="social-text">Entrar com Telefone</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <aside className="login-right" aria-hidden="true">
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
