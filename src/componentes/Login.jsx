import { useState, useEffect, useRef, useCallback } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import { persistAuthSession } from '../services/authUtils.js'
import { login as loginApi, register as registerApi, loginWithGoogle as loginWithGoogleApi } from '../services/api.js'
import googleIcon from '../assets/OIP.png'
import loginImage from '../assets/imagelogCasa.jpg'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const loadGoogleScript = () => new Promise((resolve, reject) => {
  if (window.google?.accounts?.id) {
    resolve()
    return
  }

  const existingScript = document.querySelector('script[data-google-identity="true"]')
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(), { once: true })
    existingScript.addEventListener('error', () => reject(new Error('Falha ao carregar script do Google.')), { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.dataset.googleIdentity = 'true'
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('Falha ao carregar script do Google.'))
  document.head.appendChild(script)
})


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
  const [resetIdentifier, setResetIdentifier] = useState('')
  const [resetUser, setResetUser] = useState(null)
  const [resetStep, setResetStep] = useState('identify') // 'identify', 'code', 'new-password'
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmPassword, setNewConfirmPassword] = useState('')
  const [success, setSuccess] = useState('')

  // Estados gerais
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const googleButtonRef = useRef(null)

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

  const authenticateUser = useCallback((user, token = null) => {
    persistAuthSession(user, rememberMe, token)

    if (onLoginSuccess) {
      onLoginSuccess()
    } else {
      window.location.href = '/'
    }
  }, [rememberMe, onLoginSuccess])

  const handleGoogleCredential = useCallback(async (response) => {
    const credential = response?.credential

    if (!credential) {
      setError('Nao foi possivel obter token do Google')
      return
    }

    setGoogleLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await loginWithGoogleApi(credential)
      authenticateUser(result.user, result.token)
    } catch (requestError) {
      setError(requestError.message || 'Erro ao autenticar com Google')
    } finally {
      setGoogleLoading(false)
    }
  }, [authenticateUser])

  useEffect(() => {
    if (authMode !== 'google') {
      return
    }

    let isCancelled = false

    const initGoogleLogin = async () => {
      if (!GOOGLE_CLIENT_ID) {
        setGoogleReady(false)
        setError('Defina VITE_GOOGLE_CLIENT_ID no .env para habilitar o login Google')
        return
      }

      setGoogleLoading(true)
      try {
        await loadGoogleScript()
        if (isCancelled || !window.google?.accounts?.id) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = ''
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 320,
          })
        }

        setGoogleReady(true)
      } catch (googleError) {
        setGoogleReady(false)
        setError(googleError.message || 'Falha ao iniciar login Google')
      } finally {
        setGoogleLoading(false)
      }
    }

    initGoogleLogin()

    return () => {
      isCancelled = true
    }
  }, [authMode, handleGoogleCredential])
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
      ...(resetUser.password ? {} : { loginPreference: 'email' }),
    }

    updateUserInStorage(updatedUser)
    resetForgotPasswordForm()
    setAuthMode('traditional')
    setSuccess('Senha alterada com sucesso. Voce ja pode entrar.')
  }

  // Login tradicional
  const handleTraditionalLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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

      setIsSubmitting(true)
      try {
        const result = await registerApi({
          username,
          fullName: username,
          email,
          password,
        })

        authenticateUser(result.user, result.token)
      } catch (requestError) {
        setError(requestError.message || 'Erro ao criar conta')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Login com usuario/email existente
      if (!email.trim() || !password.trim()) {
        setError('Por favor preencha todos os campos')
        return
      }

      setIsSubmitting(true)
      try {
        const result = await loginApi(email, password)
        authenticateUser(result.user, result.token)
      } catch (requestError) {
        setError(requestError.message || 'Erro ao entrar')
      } finally {
        setIsSubmitting(false)
      }
    }
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
                <button className="login-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Aguarde...' : 'Entrar'}
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
                      setSuccess('')
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
            <div className="login-form">
              <h3 className="auth-title">Login com Google</h3>
              <p className="code-info">Use sua conta Google para entrar com seguranca.</p>

              {!GOOGLE_CLIENT_ID && (
                <div className="login-error">Variavel VITE_GOOGLE_CLIENT_ID nao configurada.</div>
              )}

              {googleLoading && <div className="code-info">Carregando autenticacao Google...</div>}
              <div ref={googleButtonRef} style={{ display: googleReady ? 'flex' : 'none', justifyContent: 'center', margin: '12px 0 8px' }} />

              {error && <div className="login-error">{error}</div>}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  type="button"
                  className="login-submit"
                  onClick={() => {
                    setAuthMode('traditional')
                    setError('')
                  }}
                  style={{ background: '#fff', color: 'var(--accent-dark)', border: '2px solid rgba(33,64,27,0.06)', width: 110 }}
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

        </div>
        <aside className="login-right" aria-hidden="true">
          <img src={loginImage} alt="Casa limpa" className="side-image" />
        </aside>
      </section>
    </main>
  )
}
