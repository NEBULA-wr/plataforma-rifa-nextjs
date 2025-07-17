// components/InteractiveTombola.js

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const InteractiveTombola = ({ tickets = [], isSpinning }) => {
    const cageRef = useRef(null);
    const sceneRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Este efecto mide el contenedor una vez que está en pantalla
    useEffect(() => {
        if (sceneRef.current) {
            setContainerWidth(sceneRef.current.offsetWidth);
        }
    }, []);

    const ballPositions = useMemo(() => {
        if (containerWidth === 0 || tickets.length === 0) return {};
        
        const positions = {};
        const radius = containerWidth / 2.2;
        
        tickets.forEach((ticket, i) => {
            const phi = Math.acos(-1 + (2 * i) / (tickets.length - 1));
            const theta = Math.sqrt(tickets.length * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            positions[ticket.id] = `translate3d(${x}px, ${y}px, ${z}px)`;
        });
        return positions;
    }, [tickets, containerWidth]);

    useEffect(() => {
        const cage = cageRef.current;
        if (!cage) return;

        if (isSpinning) {
            gsap.to(cage, {
                duration: 8,
                rotationY: '+=3600',
                rotationX: 'random(-40, 20)',
                rotationZ: 'random(-10, 10)',
                ease: 'power1.inOut',
            });
        } else {
            gsap.killTweensOf(cage);
            gsap.to(cage, { duration: 1.5, rotationY: 0, rotationX: -15, rotationZ: 0, ease: 'power3.out' });
        }
    }, [isSpinning]);

    return (
        <div className="tombola-scene" ref={sceneRef}>
            <div className="tombola-cage" ref={cageRef}>
                {Array.from({ length: 12 }).map((_, i) => <div key={`bar-${i}`} className="cage-bar" style={{ transform: `rotateY(${i * 15}deg)` }}></div>)}
                
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="tombola-ball"
                        style={{ transform: ballPositions[ticket.id] || 'translate3d(0,0,0)' }}
                    >
                        {String(ticket.ticket_number).padStart(3, '0')}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default InteractiveTombola;