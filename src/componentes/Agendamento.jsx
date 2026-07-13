import { useState } from 'react'
import { criarAgendamento } from '../services/api.js'
import './Agendamento.css'
import { FaWhatsapp, FaPhone, FaClock, FaCheckCircle } from 'react-icons/fa'

function Agendamento() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: 'Limpeza residencial',
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
      setSuccessMessage(`Pedido enviado, ${formData.nome}! Nossa equipe confirmara seu agendamento por WhatsApp.`)
      setFormData({
        nome: '',
        telefone: '',
        servico: 'Limpeza residencial',
        data: '',
        observacoes: '',
      })
    } catch (error) {
      setErrorMessage(error.message || 'Nao foi possivel enviar o agendamento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="agendamento-container">
      <section className="agendamento-banner" aria-label="Agendamento de serviços">
        <div className="agendamento-banner-content">
          <p className="agendamento-eyebrow">Agendamento rápido</p>
          <h1>Reserve seu atendimento em poucos minutos</h1>
          <p>Escolha o serviço, informe sua disponibilidade e nossa equipe entra em contato com você.</p>
          <div className="agendamento-badges">
            <span><FaCheckCircle /> Atendimento ágil</span>
            <span><FaCheckCircle /> Agendamento simples</span>
            <span><FaCheckCircle /> Confirmação por WhatsApp</span>
          </div>
        </div>
      </section>

      <section className="agendamento-content">
        <div className="agendamento-grid">
          <form className="agendamento-panel agendamento-form-panel" onSubmit={handleSubmit}>
            <h2>Solicitar agendamento</h2>
            {successMessage && <p className="agendamento-alert success" role="status">{successMessage}</p>}
            {errorMessage && <p className="agendamento-alert error" role="alert">{errorMessage}</p>}

            <div className="agendamento-field">
              <label htmlFor="agendamento-nome">Nome</label>
              <input id="agendamento-nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome" required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-telefone">Telefone</label>
              <input id="agendamento-telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-servico">Serviço</label>
              <select id="agendamento-servico" name="servico" value={formData.servico} onChange={handleChange}>
                <option>Limpeza residencial</option>
                <option>Limpeza pós-obra</option>
                <option>Organização de ambientes</option>
                <option>Jardinagem</option>
                <option>Assistência doméstica</option>
                <option>Faxina</option>
              </select>
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-data">Data desejada</label>
              <input id="agendamento-data" name="data" type="date" min={minDate} value={formData.data} onChange={handleChange} required />
            </div>

            <div className="agendamento-field">
              <label htmlFor="agendamento-observacoes">Observações</label>
              <textarea id="agendamento-observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" placeholder="Conte mais sobre sua necessidade" />
            </div>

            <button type="submit" className="agendamento-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar pedido'}
            </button>
          </form>

          <aside className="agendamento-panel agendamento-info-panel">
            <h2>Como funciona</h2>
            <ol className="agendamento-steps">
              <li><span className="step-number">1</span>Você nos conta qual serviço precisa.</li>
              <li><span className="step-number">2</span>Definimos data e horário com mais praticidade.</li>
              <li><span className="step-number">3</span>Confirmamos tudo pelo WhatsApp.</li>
            </ol>

            <div className="agendamento-contact-box">
              <strong><FaClock /> Atendimento rápido</strong>
              <a href="https://wa.me/551190028922" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                <FaWhatsapp /> Fale pelo WhatsApp
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
