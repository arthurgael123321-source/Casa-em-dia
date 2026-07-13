import heroImage from '../assets/CasaImpecavel.png'
import { buildServices } from './servicosData'
import { useLanguage } from '../i18n/languageStore.js'

function Servicos({ onContactClick, onPlanosClick, onServicePageClick }) {
  const { t, language } = useLanguage()
  const services = buildServices(language)

  return (
    <div className="services-shell">
      <section className="service-hero" aria-label="Serviços de limpeza">
        <div className="hero-copy">
          <p className="eyebrow">{t('servicos.eyebrow')}</p>
          <h2>{t('servicos.titulo')}</h2>
          <p>{t('servicos.descricao')}</p>
          <div className="hero-buttons">
            <button className="hero-cta" onClick={() => onContactClick && onContactClick()}>
              {t('servicos.agendeAgora')}
            </button>
            <button className="hero-secondary" onClick={() => onPlanosClick && onPlanosClick()}>
              {t('servicos.verPlanos')}
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImage} alt="Serviços de limpeza doméstica" />
        </div>
      </section>

      <section className="services-highlight-strip" aria-label="Diferenciais da Casa em Dia">
        <article className="highlight-card">
          <strong>{t('servicos.diferenciais.atendimentoTitulo')}</strong>
          <p>{t('servicos.diferenciais.atendimentoDesc')}</p>
        </article>
        <article className="highlight-card">
          <strong>{t('servicos.diferenciais.equipeTitulo')}</strong>
          <p>{t('servicos.diferenciais.equipeDesc')}</p>
        </article>
        <article className="highlight-card">
          <strong>{t('servicos.diferenciais.flexibilidadeTitulo')}</strong>
          <p>{t('servicos.diferenciais.flexibilidadeDesc')}</p>
        </article>
      </section>

      <section className="services-card" aria-label="Detalhes dos serviços">
        <div className="services-section-head">
          <div>
            <p className="eyebrow">{t('servicos.escolhaTipo')}</p>
            <h3 className="services-title">{t('servicos.principaisServicos')}</h3>
          </div>
          <button className="hero-secondary" onClick={() => onContactClick && onContactClick()}>
            {t('servicos.faleComEquipe')}
          </button>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.slug} className="service-detail-card">
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
                {t('servicos.verServico')}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Servicos
