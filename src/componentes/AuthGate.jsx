import './AuthGate.css'
import Login from './Login.jsx'

export default function AuthGate({ message, onClose, onLoginSuccess }) {
  return (
    <div
      className="auth-gate-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Login necessário"
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
          aria-label="Fechar"
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
