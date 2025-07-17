import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const RaffleWheel = forwardRef(({ segments, onFinished }, ref) => {
  const canvasRef = useRef(null);
  const winwheelRef = useRef(null);

  useEffect(() => {
    // Verificamos si Winwheel está disponible en el objeto window
    // y si tenemos segmentos para dibujar.
    if (window.Winwheel && canvasRef.current && segments.length > 0 && !winwheelRef.current) {
        const wheel = new window.Winwheel({
            'canvasId': 'raffleCanvas',
            'numSegments': segments.length,
            'outerRadius': 210,
            'textFontSize': 14,
            'textAlignment': 'outer',
            'textMargin': 5,
            'segments': segments,
            'animation': {
                'type': 'spinToStop',
                'duration': 10, // Duración del giro en segundos
                'spins': 15,    // Número de vueltas que dará
                'callbackFinished': onFinished,
            },
            'pointerGuide': {
                'display': true,
                'strokeStyle': 'white',
                'lineWidth': 3
            }
        });
        winwheelRef.current = wheel;
    }
  }, [segments, onFinished]);

  const startSpin = (stopAt) => {
    if (winwheelRef.current) {
        // Reseteamos la ruleta antes de un nuevo giro si es necesario
        winwheelRef.current.stopAnimation(false);
        winwheelRef.current.rotationAngle = 0;
        winwheelRef.current.draw();
        
        // Calculamos el ángulo para detenerse en el segmento ganador
        const stopAngle = winwheelRef.current.getAngleOfSegment(stopAt);
        winwheelRef.current.animation.stopAngle = stopAngle;
        winwheelRef.current.startAnimation();
    }
  };

  // Exponemos la función startSpin al componente padre a través de la ref
  useImperativeHandle(ref, () => ({
    startSpin
  }));

  return <canvas id="raffleCanvas" ref={canvasRef} width="450" height="450" style={{maxWidth: '100%', height: 'auto'}}></canvas>;
});

RaffleWheel.displayName = 'RaffleWheel';
export default RaffleWheel;