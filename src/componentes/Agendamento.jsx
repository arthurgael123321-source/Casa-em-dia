import { useState } from 'react'
import { criarAgendamento } from '../services/api.js'
import './Agendamento.css'
import { FaWhatsapp, FaPhone, FaClock, FaCheckCircle } from 'react-icons/fa'
import { useLanguage } from '../i18n/languageStore.js'

function Agendamento() {
  const { t } = useLanguage()
  const servicosOpcoes = t('agendamento.servicosOpcoes')
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: servicosOpcoes[0],
    data: '',
    observacoes: '',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const minDate = new Date().toISOString().split('T')[0]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await criarAgendamento(formData)
      setSuccessMessage(t('agendamento.sucesso', { nome: formData.nome }))
      setFormData({
        nome: '',
        telefone: '',
        servico: servicosOpcoes[0],
        data: '',
        observacoes: '',
      })
    } catch (error) {
      setErrorMessage(error.message || t('agendamento.erroGenerico'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="agendamento-container">
      <section className="agendamento-banner" aria-label="Agendamento de serviços">
        <div className="agendamento-banner-content">
          <p className="agendamento-eyebrow">{t('agendamento.eyebrow')}</p>
          <h1>{t('agendamento.titulo')}</h1>
          <p>{t('agendamento.subtitulo')}</p>
          <div className="agendamento-badges">
            <span><FaCheckCircle /> {t('agendamento.badgeAgil')}</span>
            <span><FaCheckCircle /> {t('agendamento.badgeSimples')}</span>
            <span><FaCheckCircle /> {t('agendamento.badgeWhatsapp')}</span>
          </div>
        </div>
      </section>

      <section className="agendamento-content">
        <div className="agendamento-grid">
          <form className="agendamento-panel agendamento-form-panel" onSubmit={handleSubmit}>
            <h2>{t('agendamento.solicitar')}</h2>
            {successMessage && <p className="agendamento-alert success" role="status">{successMessage}</p>}
            {errorMessage && <p className="agendamento-alert error" role="alert">{errorMessage}</p>}

            <div className="agendamento-field">
              <label htmlFor="agendamento-nome">{t('agendamento.nome')}</label>
              <input id="agendamento-nome" name="nome" value={formData.nome} onChange={handleChange} placeholder={t('agendamento.nomePlaceholder')} required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-telefone">{t('agendamento.telefone')}</label>
              <input id="agendamento-telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-servico">{t('agendamento.servico')}</label>
              <select id="agendamento-servico" name="servico" value={formData.servico} onChange={handleChange}>
                {servicosOpcoes.map((opcao) => (
                  <option key={opcao}>{opcao}</option>
                ))}
              </select>
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-data">{t('agendamento.dataDesejada')}</label>
              <input id="agendamento-data" name="data" type="date" min={minDate} value={formData.data} onChange={handleChange} required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-observacoes">{t('agendamento.observacoes')}</label>
              <textarea id="agendamento-observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" placeholder={t('agendamento.observacoesPlaceholder')} />
            </div>

            <button type="submit" className="agendamento-submit" disabled={isSubmitting}>
              {isSubmitting ? t('agendamento.enviando') : t('agendamento.enviarPedido')}
            </button>
          </form>

          <aside className="agendamento-panel agendamento-info-panel">
            <h2>{t('agendamento.comoFunciona')}</h2>
            <ol className="agendamento-steps">
              <li><span className="step-number">1</span>{t('agendamento.passo1')}</li>
              <li><span className="step-number">2</span>{t('agendamento.passo2')}</li>
              <li><span className="step-number">3</span>{t('agendamento.passo3')}</li>
            </ol>

            <div className="agendamento-contact-box">
              <strong><FaClock /> {t('agendamento.atendimentoRapido')}</strong>
              <a href="https://wa.me/551190028922" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                <FaWhatsapp /> {t('agendamento.falePeloWhatsapp')}
              </a>
              <a href="tel:+551190028922" className="contact-link phone">
                <FaPhone /> (11) 9002-8922
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default Agendamento
