import { serviceMap } from './servicosData'

function ServicoDetalhe({ serviceSlug, onScheduleClick, onServicosClick }) {
  const service = serviceMap[serviceSlug]

  if (!service) {
    return (
      <div className="service-detail-page">
        <h1>Serviço não encontrado</h1>
        <p>O serviço solicitado não está disponível no momento.</p>
        <button onClick={() => onServicosClick && onServicosClick()}>Voltar para serviços</button>
      </div>
    )
  }

  return (
    <div className="service-detail-page">
          <article className="service-detail-hero">
            <div className="hero-copy">
              <p className="eyebrow">Serviço personalizado</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="hero-buttons">
                <button className="hero-cta" onClick={() => onScheduleClick && onScheduleClick()}>
                  Agendar agora
                </button>
                <button className="hero-secondary" onClick={() => onServicosClick && onServicosClick()}>
                  Ver todos os serviços
                </button>
              </div>
            </div>
            <div className="hero-image service-detail-image">
              <img src={service.image} alt={service.title} />
            </div>
          </article>

          <article className="service-detail-info">
            <h2>O que está incluso</h2>
            <ul>
              {service.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
    </div>
  )
}

export default ServicoDetalhe
