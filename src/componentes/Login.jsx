import { useState, useEffect } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import { persistAuthSession } from '../services/authUtils.js'
import googleIcon from '../assets/OIP.png'
import loginImage from '../assets/imagelogCasa.jpg'


export default function Login({ onBack, onLoginSuccess }) {
  // Estados de login tradicional
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  // Estados de autenticação social
  const [authMode, setAuthMode] = useState(() => (
    localStorage.getItem('preferredLoginMethod') === 'google' ? 'google' : 'traditional'
  )) // 'traditional', 'google', 'facebook', 'sms'
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [codeWasSent, setCodeWasSent] = useState(false)
  const [socialEmail, setSocialEmail] = useState('')
  const [resetIdentifier, setResetIdentifier] = useState('')
  const [resetUser, setResetUser] = useState(null)
  const [resetStep, setResetStep] = useState('identify') // 'identify', 'code', 'new-password'
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmPassword, setNewConfirmPassword] = useState('')
  const [success, setSuccess] = useState('')

  // Estados gerais
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true')

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

  const getUsersFromStorage = () => {
    const usersJSON = localStorage.getItem('users')
    if (!usersJSON) return []

    try {
      const users = JSON.parse(usersJSON)
      return Array.isArray(users) ? users : []
    } catch {
      localStorage.removeItem('users')
      return []
    }
  }

  const saveUserToStorage = (user) => {
    const users = getUsersFromStorage()
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
  }

  const updateUserInStorage = (updatedUser) => {
    const users = getUsersFromStorage()
    const updatedUsers = users.map((user) => (
      user.id === updatedUser.id ? updatedUser : user
    ))
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const findUser = (emailOrUsername) => {
    const users = getUsersFromStorage()
    return users.find(u => u.email === emailOrUsername || u.username === emailOrUsername)
  }

  const authenticateUser = (user) => {
    persistAuthSession(user, rememberMe)

    if (onLoginSuccess) {
      onLoginSuccess()
    } else {
      window.location.href = '/'
    }
  }
  const resetForgotPasswordForm = () => {
    setResetIdentifier('')
    setResetUser(null)
    setResetStep('identify')
    setVerificationCode('')
    setSentCode('')
    setNewPassword('')
    setNewConfirmPassword('')
    setError('')
    setSuccess('')
  }

  const handleForgotPasswordSend = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!resetIdentifier.trim()) {
      setError('Digite seu email ou usuario')
      return
    }

    const user = findUser(resetIdentifier)
    if (!user) {
      setError('Usuario ou email nao encontrado')
      return
    }

    if (user.password === null) {
      setError('Essa conta foi criada com o Google, portanto nao possui senha para resetar. Tente entrar com o Google.')
      return
    }

    const code = generateRandomCode()
    setResetUser(user)
    setSentCode(code)
    setVerificationCode('')
    setResetStep('code')
  }

  const handleForgotPasswordCodeVerify = (e) => {
    e.preventDefault()
    setError('')

    if (!verificationCode.trim()) {
      setError('Digite o codigo de verificacao')
      return
    }

    if (verificationCode !== sentCode) {
      setError('Codigo incorreto')
      return
    }

    setResetStep('new-password')
    setVerificationCode('')
  }

  const handlePasswordReset = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword.trim() || !newConfirmPassword.trim()) {
      setError('Preencha a nova senha e a confirmacao')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (newPassword !== newConfirmPassword) {
      setError('As senhas nao conferem')
      return
    }

    const updatedUser = {
      ...resetUser,
      password: newPassword,
    }

    updateUserInStorage(updatedUser)
    resetForgotPasswordForm()
    setAuthMode('traditional')
    setSuccess('Senha alterada com sucesso. Voce ja pode entrar.')
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

      const existingUser = findUser(email) || findUser(username)
      if (existingUser) {
        setError('Email ou usuário já cadastrado')
        return
      }

      const newUser = {
        id: Date.now(),
        username,
        fullName: username,
        email,
        password,
        phone: '',
        address: '',
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

const user = findUser(email)

if (!user) {
  setError('Usuário não encontrado')
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

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login">
        <div className="login-left">
          <div className="logo-wrap">
      <img
        src={logo}
        alt="Casa em Dia"
        className="login-logo"
      />
    </div>
          {authMode === 'traditional' && (
            <form 
  className="login-form"
  onSubmit={handleTraditionalLogin}
>
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
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => {
                      resetForgotPasswordForm()
                      setAuthMode('forgot-password')
                    }}
                  >
                    Esqueci minha senha
                  </button>
                </>
              )}

              {!isNewUser && (
                <div className="login-checks">
                  <label className="remember-switch">
                    <input
                      className="remember-input"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span className={`switch ${rememberMe ? 'active' : ''}`} aria-hidden="true">
                      <div className="switch-ball"></div>
                    </span>
                    <span>Lembre de mim</span>
                      </label>
                      </div>
                    )}

              {error && <div className="login-error">{error}</div>}
              {success && <div className="login-success">{success}</div>}

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
                <button className="login-submit" type="submit">
                  Entrar
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
                  setSuccess('')
                }}
              >
                {isNewUser ? 'Já tem uma conta? Faça login' : 'Não tem conta? Crie uma'}
              </button>

              <div className="social-area">
                <div className="social-title">|Entrar com</div>
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
                  
                </div>
              </div>
            </form>
          )}

          {authMode === 'forgot-password' && (
           <form 
  className="login-form"
  onSubmit={
    resetStep === 'identify'
      ? handleForgotPasswordSend
      : resetStep === 'code'
        ? handleForgotPasswordCodeVerify
        : handlePasswordReset
  }
>
            
              <h3 className="auth-title">Recuperar senha</h3>

              {resetStep === 'identify' && (
                <>
                  <input
                    id="reset-identifier"
                    className="login-input"
                    type="text"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="Email ou usuario cadastrado"
                    required
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        resetForgotPasswordForm()
                        setAuthMode('traditional')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Enviar Codigo</button>
                  </div>
                </>
              )}

              {resetStep === 'code' && (
                <>
                  <div className="code-display">
                    <p className="code-text">Seu codigo de recuperacao e:</p>
                    <div className="code-box">{sentCode}</div>
                    <p className="code-info">Use esse codigo para criar uma nova senha.</p>
                  </div>
                  <input
                    id="reset-code"
                    className="login-input"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Digite o codigo"
                    required
                    maxLength="6"
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setResetStep('identify')
                        setVerificationCode('')
                        setError('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Verificar Codigo</button>
                  </div>
                </>
              )}

              {resetStep === 'new-password' && (
                <>
                  <input
                    id="new-password"
                    className="login-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha"
                    required
                    minLength={6}
                  />
                  <input
                    id="new-confirm-password"
                    className="login-input"
                    type="password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder="Confirmar nova senha"
                    required
                    minLength={6}
                  />
                  {error && <div className="login-error">{error}</div>}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-submit"
                      onClick={() => {
                        setResetStep('code')
                        setNewPassword('')
                        setNewConfirmPassword('')
                        setError('')
                      }}
                      style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                    >
                      Voltar
                    </button>
                    <button className="login-submit" type="submit">Salvar Senha</button>
                  </div>
                </>
              )}
            </form>
          )}

          {authMode === 'google' && (
            <form 
 className="login-form"
 onSubmit={codeWasSent ? handleGoogleCodeVerify : handleGoogleCodeSend}
>
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

        </div>
        <aside className="login-right" aria-hidden="true">
          <img src={loginImage} alt="Casa limpa" className="side-image" />
        </aside>
      </section>
    </main>
  )
}
