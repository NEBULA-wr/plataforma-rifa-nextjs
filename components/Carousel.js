import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ImageModal = ({ src, onClose }) => {
    if (!src) return null;
    const [isActive, setIsActive] = useState(false);
    React.useEffect(() => {
        setIsActive(true);
        const handleEsc = (event) => { if (event.keyCode === 27) handleClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);
    const handleClose = () => { setIsActive(false); setTimeout(onClose, 300); };
    return (
        <div className={`image-modal-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Usamos layout="fill" para el modal, aquí no necesita sizes */}
                <Image src={src} alt="Vista ampliada" layout="fill" objectFit="contain" />
            </div>
            <button className="close-modal-button" onClick={handleClose}>×</button>
        </div>
    );
};

const Carousel = () => {
  const [modalImage, setModalImage] = useState(null);
  const images = ['/images/barberia-1.jpg', '/images/barberia-2.jpg', '/images/barberia-3.jpg', '/images/barberia-4.jpg', '/images/barberia-5.jpg', '/images/barberia-6.jpg', '/images/barberia-7.jpg'];
  return (
    <>
      <div className="coverflow-carousel">
        <Swiper
          effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true, }}
          pagination={{ clickable: true }} navigation={true} modules={[EffectCoverflow, Autoplay, Navigation, Pagination]} >
          {images.map((src, index) => (
            <SwiperSlide key={index} onClick={() => setModalImage(src)}>
              {/* **AQUÍ ESTÁ LA CORRECCIÓN CLAVE PARA LOS WARNINGS** */}
              <Image 
                src={src} 
                alt={`Imagen de la barbería ${index + 1}`} 
                fill // Usamos 'fill' para que la imagen ocupe todo el contenedor del slide
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Le decimos al navegador qué tamaño usar
                style={{ objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {modalImage && <ImageModal src={modalImage} onClose={() => setModalImage(null)} />}
    </>
  );
};
export default Carousel;