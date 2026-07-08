import { useState } from 'react'

function Agendamento() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: 'Limpeza residencial',
    data: '',
    observacoes: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(`Agendamento solicitado para ${formData.nome || 'o cliente'} com sucesso!`)
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
            <input name="data" type="date" value={formData.data} onChange={handleChange} required />
          </label>

          <label>
            <span>Observações</span>
            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="4" placeholder="Conte mais sobre sua necessidade" />
          </label>

          <button type="submit" className="hero-cta">Enviar pedido</button>
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
            <p>Fale com a equipe pelo WhatsApp ou pelo telefone da Casa em Dia.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Agendamento
