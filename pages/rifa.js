// pages/rifa.js

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Countdown from 'react-countdown';
import dynamic from 'next/dynamic';
import Confetti from 'react-confetti';
import { useRaffle } from '../components/context/RaffleContext'; // <-- Usamos el cerebro

const InteractiveTombola = dynamic(() => import('../components/InteractiveTombola'), { ssr: false });

const WinnerModal = ({ winner, onClose }) => {
    if (!winner) return null;
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    
    return (
        <div className="winner-modal-overlay">
            <Confetti recycle={false} numberOfPieces={600} gravity={0.15} />
            <div className={`winner-modal-content ${show ? 'active' : ''}`}>
                <button className="close-winner-modal" onClick={onClose}>×</button>
                <div className="winner-modal-ball">{String(winner.ticket_number).padStart(3, '0')}</div>
                <h2 className="winner-modal-title">¡Tenemos un Ganador!</h2>
                <p className="winner-modal-subtitle">El boleto premiado es el N° {String(winner.ticket_number).padStart(3, '0')}</p>
                <p className="winner-modal-owner">Comprado por: <strong>{winner.owner_name}</strong></p>
            </div>
        </div>
    );
};

const RafflePage = () => {
    // Obtenemos todo del cerebro central, ya no hay lógica aquí
    const { allTickets, winner, isSpinning, showWinnerModal, setShowWinnerModal } = useRaffle();
    const [raffleEndDate] = useState(new Date('2025-12-31T23:59:59'));
    const [hasMounted, setHasMounted] = useState(false);
  
    useEffect(() => { setHasMounted(true); }, []);

    if (!hasMounted) {
        return ( <div className="section"><h1 className="section-title">Cargando Sorteo...</h1></div> );
    }

    return (
        <div className="section">
            <Head><title>Sorteo en Vivo | Barbería Rifa</title></Head>
            {showWinnerModal && <WinnerModal winner={winner} onClose={() => setShowWinnerModal(false)} />}
            <h1 className="section-title">Sorteo en Vivo</h1>
            <div className="card" style={{marginBottom: '2rem'}}>
                <h3 style={{color: 'var(--primary)', marginBottom: '1rem'}}>La compra de boletos cierra en:</h3>
                <Countdown date={raffleEndDate} renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) return <span>¡El tiempo para comprar ha terminado!</span>;
                    return (
                        <div className="countdown-container">
                            <div className="countdown-box"><div className="countdown-value">{days}</div><div className="countdown-label">Días</div></div>
                            <div className="countdown-box"><div className="countdown-value">{hours}</div><div className="countdown-label">Horas</div></div>
                            <div className="countdown-box"><div className="countdown-value">{minutes}</div><div className="countdown-label">Minutos</div></div>
                            <div className="countdown-box"><div className="countdown-value">{seconds}</div><div className="countdown-label">Segundos</div></div>
                        </div>
                    );
                }} />
            </div>
            
            {allTickets.length > 0 ? (
                <InteractiveTombola tickets={allTickets} isSpinning={isSpinning} />
            ) : (
                <div className="hero-subtitle" style={{padding: '4rem 0'}}>Aún no hay boletos participantes...</div>
            )}

            {!winner && !isSpinning && allTickets.length > 0 && <p className="hero-subtitle" style={{marginTop: '2rem'}}>Esperando que el administrador inicie el sorteo...</p> }
            {isSpinning && <p className="hero-subtitle" style={{marginTop: '2rem', color: 'var(--accent)'}}>¡Eligiendo un ganador... Mucha suerte!</p> }
        </div>
    );
};

export default RafflePage;