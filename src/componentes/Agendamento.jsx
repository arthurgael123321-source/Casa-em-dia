import { useState } from 'react'
import { criarAgendamento } from '../services/api.js'

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
    <section className="agendamento-page" aria-label="Agendamento de serviços">
      <div className="agendamento-hero">
        <div>
          <p className="eyebrow">Agendamento rápido</p>
          <h2>Reserve seu atendimento em poucos minutos</h2>
          <p>Escolha o serviço, informe sua disponibilidade e nossa equipe entra em contato com você.</p>
        </div>
        <div className="agendamento-badges">
          <span>✓ Atendimento ágil</span>
          <span>✓ Agendamento simples</span>
          <span>✓ Confirmação por WhatsApp</span>
        </div>
      </div>

      <div className="agendamento-grid">
        <form className="agendamento-card agendamento-form" onSubmit={handleSubmit}>
          <h3>Solicitar agendamento</h3>
          {successMessage && <p className="agendamento-success" role="status">{successMessage}</p>}
          {errorMessage && <p className="agendamento-error" role="alert">{errorMessage}</p>}

          <label>
            <span>Nome</span>
            <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome" required />
          </label>

          <label>
            <span>Telefone</span>
            <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" required />
          </label>

          <label>
            <span>Serviço</span>
            <select name="servico" value={formData.servico} onChange={handleChange}>
              <option>Limpeza residencial</option>
              <option>Limpeza pós-obra</option>
              <option>Organização de ambientes</option>
              <option>Jardinagem</option>
              <option>Assistência doméstica</option>
              <option>Faxina</option>
            </select>
          </label>

          <label>
            <span>Data desejada</span>
            <input name="data" type="date" min={minDate} value={formData.data} onChange={handleChange} required />
          </label>

          <label>
            <span>Observações</span>
            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" placeholder="Conte mais sobre sua necessidade" />
          </label>

          <button type="submit" className="hero-cta" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </form>

        <div className="agendamento-card agendamento-info">
          <h3>Como funciona</h3>
          <ol>
            <li>Você nos conta qual serviço precisa.</li>
            <li>Definimos data e horário com mais praticidade.</li>
            <li>Confirmamos tudo pelo WhatsApp.</li>
          </ol>

          <div className="agendamento-contact-box">
            <strong>Atendimento rápido</strong>
            <p><a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer">Fale com a equipe pelo WhatsApp</a> ou ligue para <a href="tel:+5511999998888">(11) 99999-8888</a>.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Agendamento
