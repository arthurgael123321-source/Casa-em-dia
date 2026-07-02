import { useState, useEffect } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import googleIcon from '../assets/OIP.png'
import fbIcon from '../assets/pngtree-facebook-logo-facebook-icon-png-image_3654755.png'
import loginImage from '../assets/hero.png'

export default function Login({ onBack }) {
  // Estados de login tradicional
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  // Estados de autenticação social
  const [authMode, setAuthMode] = useState('traditional') // 'traditional', 'google', 'facebook', 'sms'
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [codeWasSent, setCodeWasSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [socialEmail, setSocialEmail] = useState('')

  // Estados gerais
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Inicializar usuários no local storage
  useEffect(() => {
    const users = localStorage.getItem('users')
    if (!users) {
      localStorage.setItem('users', JSON.stringify([]))
    }
  }, [])

  // Funções utilitárias
  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    // Formato: (XX) 9XXXX-XXXX ou XX 9XXXX-XXXX (Brasil)
    const phoneRegex = /^\(?[0-9]{2}\)?[\s-]?9[0-9]{4}-?[0-9]{4}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
  }

  const getUsersFromStorage = () => {
    const usersJSON = localStorage.getItem('users')
    return usersJSON ? JSON.parse(usersJSON) : []
  }

  const saveUserToStorage = (user) => {
    const users = getUsersFromStorage()
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
  }

  const findUser = (emailOrUsername) => {
    const users = getUsersFromStorage()
    return users.find(u => u.email === emailOrUsername || u.username === emailOrUsername)
  }

  const authenticateUser = (user) => {
    localStorage.setItem('authToken', `token_${Date.now()}`)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('username', user.username || user.email)
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    }
    window.location.href = '/'
  }

  // Login tradicional
  const handleTraditionalLogin = (e) => {
    e.preventDefault()
    setError('')

    if (isNewUser) {
      // Criar novo usuário
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError('Por favor preencha todos os campos')
        return
      }

      if (!validateEmail(email)) {
        setError('Email inválido')
        return
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return
      }

      if (password !== confirmPassword) {
        setError('As senhas não conferem')
        return
      }

      if (!acceptTerms) {
        setError('Você deve aceitar os termos de serviço')
        return
      }

      const existingUser = findUser(email) || findUser(username)
      if (existingUser) {
        setError('Email ou usuário já cadastrado')
        return
      }

      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      }

      saveUserToStorage(newUser)
      authenticateUser(newUser)
    } else {
      // Login com usuario/email existente
      if (!email.trim() || !password.trim()) {
        setError('Por favor preencha todos os campos')
        return
      }

      if (!acceptTerms) {
        setError('Você deve aceitar os termos de serviço')
        return
      }

      const user = findUser(email)
      if (!user) {
        setError('Usuário ou email não encontrado')
        return
      }

      if (user.password !== password) {
        setError('Senha incorreta')
        return
      }

      authenticateUser(user)
    }
  }

  // Enviar código para Google
  const handleGoogleCodeSend = (e) => {
    e.preventDefault()
    setError('')

    if (!socialEmail.trim()) {
      setError('Por favor digite um email')
      return
    }

    if (!validateEmail(socialEmail)) {
      setError('Email inválido')
      return
    }

    const code = generateRandomCode()
    setSentCode(code)
    setCodeWasSent(true)
    setVerificationCode('')
  }

  // Verificar código Google
  const handleGoogleCodeVerify = (e) => {
    e.preventDefault()
    setError('')

    if (!verificationCode.trim()) {
      setError('Por favor digite o código')
      return
    }

    if (verificationCode !== sentCode) {
      setError('Código incorreto')
      return
    }

    // Criar ou encontrar usuário Google
    let user = findUser(socialEmail)
    if (!user) {
      user = {
        id: Date.now(),
        username: socialEmail.split('@')[0],
        email: socialEmail,
        password: null,
        loginMethod: 'google',
        createdAt: new Date().toISOString(),
      }
      saveUserToStorage(user)
    }

    authenticateUser(user)
  }

  // Enviar código para Facebook
  const handleFacebookCodeSend = (e) => {
    e.preventDefault()
    setError('')

    if (!socialEmail.trim()) {
      setError('Por favor digite um email')
      return
    }

    if (!validateEmail(socialEmail)) {
      setError('Email inválido')
      return
    }

    const code = generateRandomCode()
    setSentCode(code)
    setCodeWasSent(true)
    setVerificationCode('')
  }

  // Verificar código Facebook
  const handleFacebookCodeVerify = (e) => {
    e.preventDefault()
    setError('')

    if (!verificationCode.trim()) {
      setError('Por favor digite o código')
      return
    }

    if (verificationCode !== sentCode) {
      setError('Código incorreto')
      return
    }

    let user = findUser(socialEmail)
    if (!user) {
      user = {
        id: Date.now(),
        username: socialEmail.split('@')[0],
        email: socialEmail,
        password: null,
        loginMethod: 'facebook',
        createdAt: new Date().toISOString(),
      }
      saveUserToStorage(user)
    }

    authenticateUser(user)
  }

  // Enviar código para SMS
  const handleSMSCodeSend = (e) => {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('Por favor digite um número de telefone')
      return
    }

    if (!validatePhone(phone)) {
      setError('Número de telefone inválido. Use o formato: (XX) 9XXXX-XXXX')
      return
    }

    const code = generateRandomCode()
    setSentCode(code)
    setCodeWasSent(true)
    setVerificationCode('')
  }

  // Verificar código SMS
  const handleSMSCodeVerify = (e) => {
    e.preventDefault()
    setError('')

    if (!verificationCode.trim()) {
      setError('Por favor digite o código')
      return
    }

    if (verificationCode !== sentCode) {
      setError('Código incorreto')
      return
    }

    // Criar ou encontrar usuário SMS
    let user = findUser(phone)
    if (!user) {
      user = {
        id: Date.now(),
        username: `user_${phone.replace(/\D/g, '')}`,
        phone,
        email: `sms_${Date.now()}@casaemdia.local`,
        password: null,
        loginMethod: 'sms',
        createdAt: new Date().toISOString(),
      }
      saveUserToStorage(user)
    }

    authenticateUser(user)
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login">
        <div className="login-left">
          <div className="logo-wrap">
            <img src={logo} alt="Casa em Dia" className="login-logo" />
          </div>

          {authMode === 'traditional' && (
            <form className="login-form" onSubmit={handleTraditionalLogin}>
              {isNewUser ? (
                <>
                  <input
                    id="username"
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nome de usuário"
                    required
                  />
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
                    minLength={6}
                  />
                  <input
                    id="confirmPassword"
                    className="login-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar Senha"
                    required
                    minLength={6}
                  />
                </>
              ) : (
                <>
                  <input
                    id="email"
                    className="login-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email ou Usuário"
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
                </>
              )}

              <div className="login-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  Aceite os termos de serviço
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Lembre de mim
                </label>
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
                <button className="login-submit" type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              <button
                type="button"
                className="toggle-auth"
                onClick={() => {
                  setIsNewUser(!isNewUser)
                  setError('')
                  setEmail('')
                  setPassword('')
                  setUsername('')
                  setConfirmPassword('')
                }}
              >
                {isNewUser ? 'Já tem uma conta? Faça login' : 'Não tem conta? Crie uma'}
              </button>

              <div className="social-area">
                <div className="social-title">/Entrar com</div>
                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn google"
                    onClick={() => {
                      setAuthMode('google')
                      setError('')
                      setCodeWasSent(false)
                    }}
                  >
                    <img src={googleIcon} alt="Google" className="social-icon" />
                    <span className="social-text">Entrar com Google</span>
                  </button>
                  <button
                    type="button"
                    className="social-btn facebook"
                    onClick={() => {
                      setAuthMode('facebook')
                      setError('')
                      setCodeWasSent(false)
                    }}
                  >
                    <img src={fbIcon} alt="Facebook" className="social-icon" />
                    <span className="social-text white">Entrar com Facebook</span>
                  </button>
                  <button
                    type="button"
                    className="social-btn phone"
                    onClick={() => {
                      setAuthMode('sms')
                      setError('')
                      setCodeWasSent(false)
                    }}
                  >
                    📱
                    <span className="social-text">Entrar com Telefone</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {authMode === 'google' && (
            <form className="login-form" onSubmit={codeWasSent ? handleGoogleCodeVerify : handleGoogleCodeSend}>
              {!codeWasSent ? (
                <>
                  <h3 className="auth-title">Login com Google</h3>
                  <input
                    id="google-email"
                    className="login-input"
                    type="email"
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    placeholder="Digite seu email Google"
                    required
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setAuthMode('traditional')
                        setError('')
                        setSocialEmail('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Enviar Código</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="auth-title">Código Enviado</h3>
                  <div className="code-display">
                    <p className="code-text">Seu código de verificação é:</p>
                    <div className="code-box">{sentCode}</div>
                    <p className="code-info">Esse código foi enviado para {socialEmail}</p>
                  </div>
                  <input
                    id="google-code"
                    className="login-input"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Digite o código"
                    required
                    maxLength="6"
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setCodeWasSent(false)
                        setVerificationCode('')
                        setError('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Verificar Código</button>
                  </div>
                </>
              )}
            </form>
          )}

          {authMode === 'facebook' && (
            <form className="login-form" onSubmit={codeWasSent ? handleFacebookCodeVerify : handleFacebookCodeSend}>
              {!codeWasSent ? (
                <>
                  <h3 className="auth-title">Login com Facebook</h3>
                  <input
                    id="facebook-email"
                    className="login-input"
                    type="email"
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    placeholder="Digite seu email Facebook"
                    required
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setAuthMode('traditional')
                        setError('')
                        setSocialEmail('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Enviar Código</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="auth-title">Código Enviado</h3>
                  <div className="code-display">
                    <p className="code-text">Seu código de verificação é:</p>
                    <div className="code-box">{sentCode}</div>
                    <p className="code-info">Esse código foi enviado para {socialEmail}</p>
                  </div>
                  <input
                    id="facebook-code"
                    className="login-input"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Digite o código"
                    required
                    maxLength="6"
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setCodeWasSent(false)
                        setVerificationCode('')
                        setError('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Verificar Código</button>
                  </div>
                </>
              )}
            </form>
          )}

          {authMode === 'sms' && (
            <form className="login-form" onSubmit={codeWasSent ? handleSMSCodeVerify : handleSMSCodeSend}>
              {!codeWasSent ? (
                <>
                  <h3 className="auth-title">Login com SMS</h3>
                  <input
                    id="sms-phone"
                    className="login-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(XX) 9XXXX-XXXX"
                    required
                  />
                  <p className="phone-info">Formato: (DDD) 9XXXX-XXXX | Ex: (51) 98765-4321</p>
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setAuthMode('traditional')
                        setError('')
                        setPhone('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Enviar Código</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="auth-title">Código Enviado</h3>
                  <div className="code-display">
                    <p className="code-text">Seu código de verificação é:</p>
                    <div className="code-box">{sentCode}</div>
                    <p className="code-info">Esse código foi enviado para {phone}</p>
                  </div>
                  <input
                    id="sms-code"
                    className="login-input"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Digite o código"
                    required
                    maxLength="6"
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setCodeWasSent(false)
                        setVerificationCode('')
                        setError('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Verificar Código</button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
        <aside className="login-right" aria-hidden="true">
          <div className="side-image-wrap">
            <img src={loginImage} alt="Casa limpa" className="side-image" />
            <div className="side-text">
              <h3>Sua casa limpa,</h3>
              <p>sua vida leve!</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
