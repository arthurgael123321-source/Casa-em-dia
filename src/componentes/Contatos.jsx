import { useState } from 'react';
import './Contatos.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../i18n/languageStore.js';

export default function Contatos({ onHomeClick }) {
  const { t } = useLanguage();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = t('contatos.faqs');

  const canaisContato = [
    {
      icon: <FaPhone />,
      titulo: t('contatos.telefone'),
      descricao: '(11) 9002-8922',
      link: 'tel:+551190028922'
    },
    {
      icon: <FaWhatsapp />,
      titulo: t('contatos.whatsapp'),
      descricao: '(11) 9002-8922',
      link: 'https://wa.me/551190028922',
      abrirEmNovaAba: true
    },
    {
      icon: <FaEnvelope />,
      titulo: t('contatos.email'),
      descricao: 'casaemdia@gmail.com.br',
      link: 'mailto:contato@casaemdia.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      titulo: t('contatos.localizacao'),
      descricao: t('contatos.enderecoTexto'),
      link: 'https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+da+S%C3%A9%2C+100+-+S%C3%A9%2C+S%C3%A3o+Paulo+-+SP',
      abrirEmNovaAba: true
    }
  ];

  return (
    <div className="contatos-container">
      {/* Header de Navegação */}
      <header className="contatos-header">
        <button onClick={() => onHomeClick && onHomeClick()} className="btn-voltar">
          {t('contatos.voltar')}
        </button>
        <h1 className="header-title">{t('contatos.headerTitulo')}</h1>
      </header>

      {/* Banner Principal */}
      <section className="banner-contatos">
        <div className="banner-content">
          <h1>{t('contatos.bannerTitulo')}</h1>
          <p>{t('contatos.bannerTexto')}</p>
        </div>
      </section>

      {/* Canais de Contato Rápido */}
      <section className="canais-rapidos">
        <div className="container">
          <div className="canais-grid">
            {canaisContato.map((canal, index) => (
              <a
                key={index}
                href={canal.link}
                className="canal-card"
                target={canal.abrirEmNovaAba ? '_blank' : undefined}
                rel={canal.abrirEmNovaAba ? 'noopener noreferrer' : undefined}
              >
                <div className="canal-icon">{canal.icon}</div>
                <h3>{canal.titulo}</h3>
                <p>{canal.descricao}</p>
                <span className="canal-arrow"></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <h2>{t('contatos.perguntasFrequentes')}</h2>
            <p>{t('contatos.perguntasSubtitulo')}</p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`accordion-item ${activeAccordion === index ? 'active' : ''}`}
              >
                <button
                  className="accordion-button"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{faq.pergunta}</span>
                  <FaChevronDown className="chevron" />
                </button>
                <div className="accordion-content">
                  <p>{faq.resposta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
