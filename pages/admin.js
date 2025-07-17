// pages/admin.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import AdminLogin from '../components/AdminLogin'; // Importamos el login

// El contenido del panel de admin ahora es un componente separado
const AdminPanel = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: ticketsData } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
            if (ticketsData) setTickets(ticketsData);

            const { data: statusData } = await supabase.from('raffle_status').select('status, winner_ticket_id').eq('id', 1).single();
            if (statusData?.status === 'finished' && statusData?.winner_ticket_id && ticketsData) {
                const winnerData = ticketsData.find(t => t.id === statusData.winner_ticket_id);
                if (winnerData) setWinner(winnerData);
            }
        };
        fetchInitialData();
        
        const subscription = supabase.channel('public:tickets:admin-panel')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, (payload) => {
              toast.success(`Nuevo boleto #${payload.new.ticket_number} vendido!`);
              setTickets(current => [payload.new, ...current]);
          }).subscribe();
          
        return () => supabase.removeChannel(subscription);
    }, []);

    const handleStartRaffle = async () => {
        if (!password) { toast.error('Debes ingresar la contraseña para iniciar.'); return; }
        setLoading(true);
        const toastId = toast.loading('Iniciando la rifa...');
        try {
            const response = await fetch('/api/start-raffle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Algo salió mal');
            toast.success('¡Rifa iniciada! El ganador se está mostrando a todos.', { id: toastId, duration: 4000 });
            setWinner(data.winner);
        } catch (error) {
            toast.error(`Error: ${error.message}`, { id: toastId, duration: 6000 });
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        (ticket.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(ticket.ticket_number).padStart(3, '0').includes(searchTerm)
    );

    return (
        <div className="card admin-card">
            <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Panel de Administrador</h1>
            {winner ? (
                <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--accent)' }}>
                    <h3 style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.5rem' }}>¡GANADOR!</h3>
                    <div className="winner-ball" style={{ margin: '1rem auto' }}>{String(winner.ticket_number).padStart(3, '0')}</div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{winner.owner_name}</p>
                </div>
            ) : (
                <div className="admin-sub-card">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem' }}>Iniciar Sorteo</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '24rem', margin: '0 auto' }}>
                        <input type="password" placeholder="Contraseña de la Rifa" value={password} onChange={(e) => setPassword(e.target.value)} className="input-style" />
                        <button onClick={handleStartRaffle} disabled={loading || tickets.length === 0} className="btn-primary">{loading ? 'Iniciando...' : '¡INICIAR RIFA AHORA!'}</button>
                    </div>
                </div>
            )}
             <div className="admin-sub-card">
              <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem'}}>Boletos Vendidos ({tickets.length})</h2>
              <input type="text" placeholder="Buscar por nombre o número de boleto..." className="input-style" style={{marginBottom: '1.5rem'}} onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="admin-table-container">
                  <table className="admin-table">
                      <thead><tr><th># Boleto</th><th>Nombre</th><th>Email</th><th>Teléfono</th></tr></thead>
                      <tbody>
                          {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                              <tr key={ticket.id}>
                                  <td style={{fontWeight: 700, color: 'var(--accent)'}}>{String(ticket.ticket_number).padStart(3, '0')}</td>
                                  <td>{ticket.owner_name}</td>
                                  <td>{ticket.owner_email}</td>
                                  <td>{ticket.owner_phone}</td>
                              </tr>
                          )) : (
                              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-dark)'}}>No hay boletos vendidos.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
    );
};

// Página principal que decide si mostrar el login o el panel
export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="section">
            <Head><title>Panel de Administrador | Barbería Rifa</title></Head>
            {!isAuthenticated ? (
                <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
                <AdminPanel />
            )}
        </div>
    );
}