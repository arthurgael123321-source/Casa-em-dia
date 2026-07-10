import heroImage from '../assets/hero.png'
import services from './servicosData'

function Servicos({ onContactClick, onPlanosClick, onServicePageClick }) {
  return (
    <div className="services-shell">
      <section className="service-hero" aria-label="Serviços de limpeza">
        <div className="hero-copy">
          <p className="eyebrow">Serviços de limpeza com excelência</p>
          <h2>Casa impecável, rotina leve e atendimento próximo</h2>
          <p>
            Da limpeza residencial à organização e jardinagem, a Casa em Dia reúne cuidado, praticidade e
            profissionais experientes para transformar seu dia a dia com mais conforto.
          </p>
          <div className="hero-buttons">
            <button className="hero-cta" onClick={() => onContactClick && onContactClick()}>
              Agende agora
            </button>
            <button className="hero-secondary" onClick={() => onPlanosClick && onPlanosClick()}>
              Ver planos
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImage} alt="Serviços de limpeza doméstica" />
        </div>
      </section>

      <section className="services-highlight-strip" aria-label="Diferenciais da Casa em Dia">
        <article className="highlight-card">
          <strong>Atendimento ágil</strong>
          <p>Agendamento simples e confirmação rápida para o seu tempo.</p>
        </article>
        <article className="highlight-card">
          <strong>Equipe qualificada</strong>
          <p>Profissionais treinados para entregar precisão e cuidado.</p>
        </article>
        <article className="highlight-card">
          <strong>Flexibilidade</strong>
          <p>Serviços sob medida para residências, reformas e rotina.</p>
        </article>
      </section>

      <section className="services-card" aria-label="Detalhes dos serviços">
        <div className="services-section-head">
          <div>
            <p className="eyebrow">Escolha o tipo de cuidado</p>
            <h3 className="services-title">Nossos principais serviços</h3>
          </div>
          <button className="hero-secondary" onClick={() => onContactClick && onContactClick()}>
            Fale com a equipe
          </button>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.title} className="service-detail-card">
              <img
                src={service.image || heroImage}
                alt={service.title}
                className="service-card-image"
                onError={(event) => {
                  event.currentTarget.src = heroImage
                }}
              />
              <h4>{service.title}</h4>
              <p>{service.description}</p>
              <button type="button" className="service-card-button" onClick={() => onServicePageClick && onServicePageClick(service.slug)}>
                Ver serviço
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Servicos
