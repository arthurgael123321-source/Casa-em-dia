import { useState } from 'react'
import slideGarden from '../assets/primeira imagem carrosel.png'
import slideRepair from '../assets/Segunda imagem carrosel.png'
import slideCleaning from '../assets/terceira imagem carrosel.png'
import { useLanguage } from '../i18n/languageStore.js'

const slides = [
  { image: slideGarden, alt: 'Jardinagem' },
  { image: slideRepair, alt: 'Reparo elétrico' },
  { image: slideCleaning, alt: 'Limpeza' },
]

function Home({ onServicosClick, onServicePageClick }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)
  const go = (i) => setIndex(i)

  return (
    <div className="carousel-wrapper">
          <div className="carousel-area">
            <div className="carousel-card" aria-live="polite">
              <img key={slides[index].image} src={slides[index].image} alt={slides[index].alt} className="carousel-image" />

              <button type="button" onClick={prev} className="carousel-arrow left" aria-label={t('home.anterior')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button type="button" onClick={next} className="carousel-arrow right" aria-label={t('home.proximo')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="carousel-indicators" role="tablist" aria-label={t('home.indicadores')}>
                {slides.map((s, i) => (
                  <button
                    key={i}
                    className={`indicator ${i === index ? 'active' : ''}`}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={t('home.slide', { n: i + 1 })}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="carousel-info-panel">
            <div className="carousel-info">
              <p className="carousel-info-text">
                <strong>{t('home.intro')}</strong>
              </p>
            </div>

            <div className="services-card" aria-label={t('home.tiposServico')}>
              <h3 className="services-title">{t('home.tiposServico')}</h3>
              <div className="services-list" role="list">
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-residencial')}>
                  <span>{t('services.limpezaResidencial.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-pos-obra')}>
                  <span>{t('services.limpezaPosObra.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('organizacao-de-ambientes')}>
                  <span>{t('services.organizacaoDeAmbientes.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('jardinagem')}>
                  <span>{t('services.jardinagem.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('assistencia-domestica')}>
                  <span>{t('services.assistenciaDomestica.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('arrumar-eletrodomesticos')}>
                  <span>{t('services.arrumarEletrodomesticos.title')}</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
              </div>
              <button type="button" className="service-page-button" onClick={() => onServicosClick && onServicosClick()}>
                {t('home.verTodos')}
              </button>
            </div>
          </div>
        </div>
  )
}

export default Home
