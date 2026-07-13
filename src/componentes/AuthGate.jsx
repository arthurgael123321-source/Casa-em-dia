import './AuthGate.css'
import Login from './Login.jsx'
import { useLanguage } from '../i18n/languageStore.js'

export default function AuthGate({ message, onClose, onLoginSuccess }) {
  const { t } = useLanguage()

  return (
    <div
      className="auth-gate-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={message || t('common.fechar')}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="auth-gate-box">
        <button
          type="button"
          className="auth-gate-close"
          aria-label={t('common.fechar')}
          onClick={onClose}
        >
          ×
        </button>
        {message && <p className="auth-gate-message">{message}</p>}
        <Login onBack={onClose} onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  )
}
