import { useState } from 'react';
import './Contatos.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaChevronDown } from 'react-icons/fa';

export default function Contatos({ onHomeClick, onLoginClick }) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    {
      pergunta: 'Como agendar um serviço?',
      resposta: 'Você pode agendar um serviço através da página de Agendamentos. Selecione a data, horário e tipo de serviço desejado. Nossa equipe confirmará seu agendamento via email ou WhatsApp.'
    },
    {
      pergunta: 'Qual é o horário de funcionamento?',
      resposta: 'Funcionamos de segunda a sexta, das 08:00 às 18:00. Aos sábados, de 09:00 às 13:00. Agendamentos podem ser feitos fora deste horário pelo site.'
    },
    {
      pergunta: 'Como cancelar ou alterar um agendamento?',
      resposta: 'Você pode cancelar ou alterar seu agendamento com até 24 horas de antecedência através do seu painel de controle ou entrando em contato conosco diretamente.'
    },
    {
      pergunta: 'Vocês oferecem garantia nos serviços?',
      resposta: 'Sim! Todos os nossos serviços possuem garantia de 30 dias. Se não ficar satisfeito, refazemos o trabalho sem custos adicionais.'
    },
    {
      pergunta: 'Quais formas de pagamento aceitam?',
      resposta: 'Aceitamos cartão de crédito, débito, PIX, boleto e dinheiro. O pagamento pode ser realizado no momento do agendamento ou presencialmente.'
    }
  ];

  const canaisContato = [
    {
      icon: <FaPhone />,
      titulo: 'Telefone',
      descricao: '(11) 99999-8888',
      link: 'tel:(11)999998888'
    },
    {
      icon: <FaWhatsapp />,
      titulo: 'WhatsApp',
      descricao: '(11) 99999-8888',
      link: 'https://wa.me/5511999998888'
    },
    {
      icon: <FaEnvelope />,
      titulo: 'Email',
      descricao: 'contato@casaemdia.com',
      link: 'mailto:contato@casaemdia.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      titulo: 'Localização',
      descricao: 'São Paulo, SP',
      link: '#'
    }
  ];

  return (
    <div className="contatos-container">
      {/* Banner Principal */}
      <section className="banner-contatos">
        <div className="banner-content">
          <h1>Fale Conosco</h1>
          <p>Estamos aqui para ajudar! Escolha a melhor forma de entrar em contato conosco.</p>
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
                target={canal.titulo === 'WhatsApp' ? '_blank' : '_self'}
                rel="noopener noreferrer"
              >
                <div className="canal-icon">{canal.icon}</div>
                <h3>{canal.titulo}</h3>
                <p>{canal.descricao}</p>
                <span className="canal-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <h2>Perguntas Frequentes</h2>
            <p>Encontre respostas para as dúvidas mais comuns</p>
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
