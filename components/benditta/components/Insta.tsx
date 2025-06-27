
import React, { useState, useRef } from "react";
import styled from "styled-components";
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types'; // Importar o tipo Swiper

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importação dinâmica do componente, desabilitando o SSR (Server-Side Rendering)
const InstagramEmbedClient = dynamic(
  () => import('@/components/InstagramEmbed'),
  { ssr: false }
);

const InstaContainer = styled.div`
  background-color: var(--color-gray-benditta);
  padding: 40px 0 01px 0 ;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin: 5px 0 40px;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--color-accent-yellow-benditta);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const StyledSwiperContainer = styled.div`
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-button-prev, .swiper-button-next {
    color: var(--color-accent-yellow-benditta);
  }

  .swiper-pagination-bullet-active {
    background-color: var(--color-accent-yellow-benditta);
  }

  /* Estilos para posicionar a paginação abaixo das imagens */
  .swiper {
    padding-bottom: 40px; /* Adiciona espaço na parte inferior do carrossel */
  }

  .swiper-pagination {
    bottom: 0; /* Posiciona a paginação no final do padding */
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
`;

const MobileOnlySlides = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

const Insta: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null); // Tipagem correta para useRef

  // Helper function to check if a slide is currently visible
  const isSlideVisible = (slideIndex: number) => {
    if (!swiperRef.current) return false;
    // Acessar params.slidesPerView com verificação de nulidade
    const slidesPerView = swiperRef.current.params.slidesPerView as number || 1; 
    return slideIndex >= activeIndex && slideIndex < activeIndex + slidesPerView;
  };

  return (
    <InstaContainer>
        <Content>
        <SectionTitle>Nossas Redes Sociais</SectionTitle>
        <StyledSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="mt-4"
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={() => {
              if (swiperRef.current) { // Verificação de nulidade
                setActiveIndex(swiperRef.current.activeIndex);
              }
            }}
          >
            <SwiperSlide key={0}>
              {isSlideVisible(0) ? (
                <InstagramEmbedClient
                  url="https://www.instagram.com/p/DJmdHdYOkym/?img_index=1"
                  width={328}
                />
              ) : (
                <div style={{ width: 328, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}></div>
              )}
            </SwiperSlide>
            <SwiperSlide key={1}>
              {isSlideVisible(1) ? (
                <InstagramEmbedClient
                  url="https://www.instagram.com/benditta_pizza/p/C4CK0v4tfRl/?img_index=5"
                  width={328}
                />
              ) : (
                <div style={{ width: 328, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}></div>
              )}
            </SwiperSlide>
            <SwiperSlide key={2}>
              {isSlideVisible(2) ? (
                <InstagramEmbedClient
                  url="https://www.instagram.com/p/DJIQ99Uy8pQ/"
                  width={328}
                />
              ) : (
                <div style={{ width: 328, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}></div>
              )}
            </SwiperSlide>
            <MobileOnlySlides>
              <SwiperSlide key={3}>
                {isSlideVisible(3) ? (
                  <InstagramEmbedClient
                    url="https://www.instagram.com/p/C70-g_1t_0Q/"
                    width={328}
                  />
                ) : (
                  <div style={{ width: 328, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}></div>
                )}
              </SwiperSlide>
              <SwiperSlide key={4}>
                {isSlideVisible(4) ? (
                  <InstagramEmbedClient
                    url="https://www.instagram.com/p/C70-g_1t_0Q/"
                    width={328}
                  />
                ) : (
                  <div style={{ width: 328, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}></div>
                )}
              </SwiperSlide>
            </MobileOnlySlides>
          </Swiper>
        </StyledSwiperContainer>
      </Content>
    </InstaContainer>
  );
};

export default Insta;




