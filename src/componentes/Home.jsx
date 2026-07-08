import { useState } from 'react'
import slideGarden from '../assets/primeira imagem carrosel.png'
import slideRepair from '../assets/Segunda imagem carrosel.png'
import slideCleaning from '../assets/terceira imagem carrosel.png'

const slides = [
  { image: slideGarden, alt: 'Jardinagem' },
  { image: slideRepair, alt: 'Reparo elétrico' },
  { image: slideCleaning, alt: 'Limpeza' },
]

function Home({ onLoginClick, onHomeClick, onContactClick, onPlanosClick, onServicosClick, onProfileClick, onConfiguracoesClick, onServicePageClick }) {
  const [index, setIndex] = useState(0)
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)
  const go = (i) => setIndex(i)

  return (
    <div className="carousel-wrapper">
          <div className="carousel-area">
            <div className="carousel-card" aria-live="polite">
              <img key={slides[index].image} src={slides[index].image} alt={slides[index].alt} className="carousel-image" />

              <button type="button" onClick={prev} className="carousel-arrow left" aria-label="Anterior">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button type="button" onClick={next} className="carousel-arrow right" aria-label="Próximo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="carousel-indicators" role="tablist" aria-label="Indicadores do carrossel">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    className={`indicator ${i === index ? 'active' : ''}`}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="carousel-info-panel">
            <div className="carousel-info">
              <p className="carousel-info-text">
                <strong>Se você não conhece nossos serviços, venha conhecer agora! Somos a empresa de limpeza básica e de serviços domésticos mais completa da região sul. Contamos com serviços e planos de assinatura de diversos níveis, desde limpezas básicas até limpezas completas, além de organização e muito mais.</strong>
              </p>
            </div>

            <div className="services-card" aria-label="Tipos de serviço">
              <h3 className="services-title">Tipos de serviço</h3>
              <div className="services-list" role="list">
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-residencial')}>
                  <span>Limpeza residencial</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-pos-obra')}>
                  <span>Limpeza pós-obra</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('organizacao-de-ambientes')}>
                  <span>Organização de ambientes</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('jardinagem')}>
                  <span>Jardinagem</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('assistencia-domestica')}>
                  <span>Assistência doméstica</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('faxina')}>
                  <span>Faxina</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
              </div>
              <button type="button" className="service-page-button" onClick={() => onServicosClick && onServicosClick()}>
                Ver todos os serviços de limpeza geral
              </button>
            </div>
          </div>
        </div>
  )
}

export default Home
