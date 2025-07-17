// components/context/RaffleContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const RaffleContext = createContext();

export const RaffleProvider = ({ children }) => {
    const [allTickets, setAllTickets] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showWinnerModal, setShowWinnerModal] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data: ticketsData } = await supabase.from('tickets').select('*');
                if (ticketsData) setAllTickets(ticketsData);

                const { data: statusData } = await supabase.from('raffle_status').select('status, winner_ticket_id').eq('id', 1).single();
                if (statusData?.status === 'finished' && statusData?.winner_ticket_id && ticketsData) {
                    const winnerData = ticketsData.find(t => t.id === statusData.winner_ticket_id);
                    if (winnerData) {
                        setWinner(winnerData);
                    }
                }
            } catch (error) { /* Silencio si no hay estado */ }
        };
        fetchInitialData();

        const channel = supabase.channel('global-raffle-listener-final-version')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'raffle_status', filter: 'id=eq.1' }, (payload) => {
                console.log('¡SEÑAL RECIBIDA! El estado de la rifa ha cambiado.', payload.new);
                const { status, winner_ticket_id } = payload.new;
                
                if (status === 'finished' && winner_ticket_id) {
                    toast.success('¡La rifa ha comenzado, mucha suerte!', { duration: 5000, icon: '🎉' });
                    setIsSpinning(true);
                    
                    setTimeout(async () => {
                        const { data: winnerData } = await supabase.from('tickets').select('*').eq('id', winner_ticket_id).single();
                        setIsSpinning(false);
                        setWinner(winnerData);
                        setShowWinnerModal(true);
                    }, 8000);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, (payload) => {
                setAllTickets(current => [...current, payload.new]);
            })
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') console.log('Cerebro Central: Conectado y escuchando para todos.');
                if (err) console.error('Cerebro Central: Error de conexión', err);
            });

        return () => supabase.removeChannel(channel);
    }, []);

    const value = { allTickets, winner, isSpinning, showWinnerModal, setShowWinnerModal };

    return (
        <RaffleContext.Provider value={value}>
            {children}
        </RaffleContext.Provider>
    );
};

export const useRaffle = () => useContext(RaffleContext);