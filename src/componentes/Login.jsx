import { useState, useEffect, useRef, useCallback } from 'react'
import '../App.css'
import './Login.css'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import { persistAuthSession } from '../services/authUtils.js'
import { login as loginApi, register as registerApi, loginWithGoogle as loginWithGoogleApi } from '../services/api.js'
import { useLanguage } from '../i18n/languageStore.js'
import googleIcon from '../assets/OIP.png'
import loginImage from '../assets/imagelogCasa.jpg'

const GOOGLE_CLIENT_ID = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '393847874149-t84gnf07986drl1920s0v54q67q4c5au.apps.googleusercontent.com'
).trim()

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
  const { t } = useLanguage()
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
      setError(t('login.erroTokenGoogle'))
      return
    }

    setGoogleLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await loginWithGoogleApi(credential)
      authenticateUser(result.user, result.token)
    } catch (requestError) {
      setError(requestError.message || t('login.erroAutenticarGoogle'))
    } finally {
      setGoogleLoading(false)
    }
  }, [authenticateUser, t])

  useEffect(() => {
    if (authMode !== 'google') {
      return
    }

    let isCancelled = false

    const initGoogleLogin = async () => {
      if (!GOOGLE_CLIENT_ID) {
        setGoogleReady(false)
        setError(t('login.erroDefinirClientId'))
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
        setError(googleError.message || t('login.erroFalhaGoogle'))
      } finally {
        setGoogleLoading(false)
      }
    }

    initGoogleLogin()

    return () => {
      isCancelled = true
    }
  }, [authMode, handleGoogleCredential, t])
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
      setError(t('login.erroDigiteEmailUsuario'))
      return
    }

    const user = findUser(resetIdentifier)
    if (!user) {
      setError(t('login.erroUsuarioNaoEncontrado'))
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
      setError(t('login.erroDigiteCodigo'))
      return
    }

    if (verificationCode !== sentCode) {
      setError(t('login.erroCodigoIncorreto'))
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
      setError(t('login.erroPreencherSenhas'))
      return
    }

    if (newPassword.length < 6) {
      setError(t('login.erroSenhaCurta6'))
      return
    }

    if (newPassword !== newConfirmPassword) {
      setError(t('login.erroSenhasNaoConferem2'))
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
    setSuccess(t('login.sucessoSenhaAlterada'))
  }

  // Login tradicional
  const handleTraditionalLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isNewUser) {
      // Criar novo usuário
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError(t('login.erroPreencherCampos'))
        return
      }

      if (!validateEmail(email)) {
        setError(t('login.erroEmailInvalido'))
        return
      }

      if (password.length < 6) {
        setError(t('login.erroSenhaCurta'))
        return
      }

      if (password !== confirmPassword) {
        setError(t('login.erroSenhasNaoConferem'))
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
        setError(requestError.message || t('login.erroCriarConta'))
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Login com usuario/email existente
      if (!email.trim() || !password.trim()) {
        setError(t('login.erroPreencherCampos'))
        return
      }

      setIsSubmitting(true)
      try {
        const result = await loginApi(email, password)
        authenticateUser(result.user, result.token)
      } catch (requestError) {
        setError(requestError.message || t('login.erroEntrar'))
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
                    placeholder={t('login.nomeDeUsuario')}
                    required
                  />
                  <input
                    id="email"
                    className="login-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.email')}
                    required
                  />
                  <input
                    id="password"
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.senha')}
                    required
                    minLength={6}
                  />
                  <input
                    id="confirmPassword"
                    className="login-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('login.confirmarSenha')}
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
                    placeholder={t('login.emailOuUsuario')}
                    required
                  />
                  <input
                    id="password"
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.senha')}
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
                    {t('login.esqueciSenha')}
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
                    <span>{t('login.lembreDeMim')}</span>
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
                    {t('login.voltar')}
                  </button>
                )}
                <button className="login-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('login.aguarde') : t('login.entrar')}
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
                {isNewUser ? t('login.jaTemConta') : t('login.naoTemConta')}
              </button>

              <div className="social-area">
                <div className="social-title">{t('login.entrarCom')}</div>
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
                    <span className="social-text">{t('login.entrarComGoogle')}</span>
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

              <h3 className="auth-title">{t('login.recuperarSenha')}</h3>

              {resetStep === 'identify' && (
                <>
                  <input
                    id="reset-identifier"
                    className="login-input"
                    type="text"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder={t('login.emailOuUsuarioCadastrado')}
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
                      {t('login.voltar')}
                    </button>
                    <button className="login-submit" type="submit">{t('login.enviarCodigo')}</button>
                  </div>
                </>
              )}

              {resetStep === 'code' && (
                <>
                  <div className="code-display">
                    <p className="code-text">{t('login.seuCodigoRecuperacao')}</p>
                    <div className="code-box">{sentCode}</div>
                    <p className="code-info">{t('login.useCodigoNovaSenha')}</p>
                  </div>
                  <input
                    id="reset-code"
                    className="login-input"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t('login.digiteCodigo')}
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
                      {t('login.voltar')}
                    </button>
                    <button className="login-submit" type="submit">{t('login.verificarCodigo')}</button>
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
                    placeholder={t('login.novaSenha')}
                    required
                    minLength={6}
                  />
                  <input
                    id="new-confirm-password"
                    className="login-input"
                    type="password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder={t('login.confirmarNovaSenha')}
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
                      {t('login.voltar')}
                    </button>
                    <button className="login-submit" type="submit">{t('login.salvarSenha')}</button>
                  </div>
                </>
              )}
            </form>
          )}

          {authMode === 'google' && (
            <div className="login-form">
              <h3 className="auth-title">{t('login.loginComGoogle')}</h3>
              <p className="code-info">{t('login.useContaGoogle')}</p>

              {!GOOGLE_CLIENT_ID && (
                <div className="login-error">{t('login.variavelNaoConfigurada')}</div>
              )}

              {googleLoading && <div className="code-info">{t('login.carregandoGoogle')}</div>}
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
                  {t('login.voltar')}
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
