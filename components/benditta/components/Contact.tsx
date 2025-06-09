import React from 'react';
import styled from 'styled-components';
import WhatsAppIcon from '@/components/icons/whatsapp-icon.svg'
import Image from 'next/image';


const ContactContainer = styled.section`
  background-color: var(--color-gray-benditta);
  padding: 100px 0;
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--color-accent-yellow-benditta);
  }
`;

const ContactDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: var(--color-dark-gray-benditta);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 50px;
`;

const ContactCard = styled.div`
  background-color: var(--color-white-benditta);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 350px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--color-accent-yellow-benditta);

`;
const CardIconSvg = styled.div`
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const CardText = styled.p`
  font-size: 1rem;
  color: var(--color-dark-gray-benditta);
  margin-bottom: 20px;
`;

const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #25D366;
  color: var(--color-white-benditta);
  font-weight: 700;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #128C7E;
    transform: translateY(-3px);
  }
  
  &:before {
    content: '📱';
    font-size: 1.2rem;
  }
`;

const LocationMap = styled.div`
  margin-top: 70px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  iframe {
    width: 100%;
    height: 400px;
    border: 0;
  }
`;

const Contact: React.FC = () => {
  return (
    <ContactContainer id="contato">
      <ContactContent>
        <SectionTitle>Entre em Contato</SectionTitle>
        <ContactDescription>
          Faça seu pedido ou tire suas dúvidas através do nosso WhatsApp. Estamos prontos para atender você!
        </ContactDescription>
        
        <ContactCards>
          <ContactCard>
            <CardIconSvg className='flex items-center' >
              <Image src={WhatsAppIcon} alt="WppIcon" width={40} height={40} />
            </CardIconSvg>
            <CardTitle>WhatsApp</CardTitle>
            <CardText>Faça seu pedido diretamente pelo WhatsApp. Atendimento rápido e eficiente.</CardText>
            <WhatsAppButton 
              href="https://wa.me/5562985703845?text=Olá! Gostaria de fazer um pedido na Benditta Pizza." 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Pedir no WhatsApp
            </WhatsAppButton>
          </ContactCard>
          
          <ContactCard>
            <CardIcon>🕒</CardIcon>
            <CardTitle>Horário de Funcionamento</CardTitle>
            <CardText>
              Terça a Domingo<br />
              19:00 às 23:00
            </CardText>
          </ContactCard>
          
          <ContactCard>
            <CardIcon>📍</CardIcon>
            <CardTitle>Localização</CardTitle>
            <CardText>
              Av. Vista Alegre, 924, São Francisco. <br />
              Goiânia - GO<br />
              Entregamos até 5 Km da Loja
            </CardText>
          </ContactCard>
        </ContactCards>
        
        <LocationMap>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.173574204335!2d-49.3272842!3d-16.6681954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef5d7b7d61e87%3A0x58a36f960e072cbf!2sBenditta%20Pizza%20Delivery!5e0!3m2!1spt-BR!2sbr!4v1746659385068!5m2!1spt-BR!2sbr" 
            allowFullScreen 
            loading="lazy" 
            title="Localização Benditta Pizza"
          ></iframe>
        </LocationMap>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;
