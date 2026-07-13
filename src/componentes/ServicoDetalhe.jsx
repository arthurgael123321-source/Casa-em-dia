import { buildServices } from './servicosData'
import { useLanguage } from '../i18n/languageStore.js'

function ServicoDetalhe({ serviceSlug, onScheduleClick, onServicosClick }) {
  const { t, language } = useLanguage()
  const service = buildServices(language).find((item) => item.slug === serviceSlug)

  if (!service) {
    return (
      <div className="service-detail-page">
        <h1>{t('servicoDetalhe.naoEncontrado')}</h1>
        <p>{t('servicoDetalhe.naoDisponivel')}</p>
        <button onClick={() => onServicosClick && onServicosClick()}>{t('servicoDetalhe.voltarServicos')}</button>
      </div>
    )
  }

  return (
    <div className="service-detail-page">
          <article className="service-detail-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t('servicoDetalhe.servicoPersonalizado')}</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="hero-buttons">
                <button className="hero-cta" onClick={() => onScheduleClick && onScheduleClick()}>
                  {t('servicoDetalhe.agendarAgora')}
                </button>
                <button className="hero-secondary" onClick={() => onServicosClick && onServicosClick()}>
                  {t('servicoDetalhe.verTodos')}
                </button>
              </div>
            </div>
            <div className="hero-image service-detail-image">
              <img src={service.image} alt={service.title} />
            </div>
          </article>

          <article className="service-detail-info">
            <h2>{t('servicoDetalhe.oQueEstaIncluso')}</h2>
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
