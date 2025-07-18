// components/VantaBackground.js

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import DOTS from 'vanta/dist/vanta.dots.min.js';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    // Solo creamos el efecto si el contenedor existe y el efecto no ha sido creado.
    if (vantaRef.current && !vantaEffectRef.current) {
      vantaEffectRef.current = DOTS({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x2d5a94,
        color2: 0x1e3a8a,
        backgroundColor: 0x020617,
        size: 2.50,
        spacing: 35.00
      });
    }

    // La función de limpieza que se ejecuta cuando el componente se desmonta.
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []); // El array vacío asegura que se ejecute solo una vez.

  // Usamos un estilo para asegurar que el div ocupe toda la pantalla como fondo.
  return (
    <div 
      ref={vantaRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1 // Lo pone detrás de todo.
      }}
    ></div>
  );
};

export default VantaBackground;