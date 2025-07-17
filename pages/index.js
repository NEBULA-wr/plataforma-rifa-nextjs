// pages/index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Carousel from '../components/Carousel';
import TicketGrid from '../components/TicketGrid';

const PurchaseForm = ({ selectedTickets, onPurchaseComplete }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const ticketPrice = 5000;
  const totalPrice = selectedTickets.length * ticketPrice;
  const formattedPrice = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(totalPrice);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(`Registrando ${selectedTickets.length} boleto(s)...`);

    const registrationPromises = selectedTickets.map(ticketNumber => 
      fetch('/api/save-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ticketNumber }),
      })
    );
    
    try {
      const results = await Promise.all(registrationPromises);
      const successfulTickets = [];
      const failedTickets = [];

      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res.ok) {
          successfulTickets.push(selectedTickets[i]);
        } else {
          failedTickets.push(selectedTickets[i]);
        }
      }
      
      toast.dismiss(toastId);

      if (successfulTickets.length > 0) {
        toast.success(`¡${successfulTickets.length} boleto(s) registrados con éxito! Gracias por participar.`);
        onPurchaseComplete(successfulTickets);
      }
      if (failedTickets.length > 0) {
        toast.error(`No se pudieron registrar los boletos: ${failedTickets.join(', ')}. Probablemente ya fueron vendidos.`);
      }

    } catch (error) {
      toast.error('Ocurrió un error de red. Inténtalo de nuevo.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h3 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem'}}>Paso Final: Registra tus Datos</h3>
      <p style={{fontSize: '1.125rem', marginBottom: '0.5rem'}}>Boletos seleccionados: <span style={{fontWeight: 700, fontSize: '1.875rem', color: 'var(--accent)'}}>{selectedTickets.length}</span></p>
      <p style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>Total a pagar: <span style={{fontWeight: 700}}>{formattedPrice}</span></p>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}>
        <input type="text" name="name" value={formData.name} placeholder="Nombre Completo" required className="input-style" onChange={handleInputChange} />
        <input type="email" name="email" value={formData.email} placeholder="Correo Electrónico" required className="input-style" onChange={handleInputChange} />
        <input type="tel" name="phone" value={formData.phone} placeholder="Número de Teléfono (WhatsApp)" required className="input-style" onChange={handleInputChange} />
        
        <button type="submit" className="btn-primary" style={{marginTop: '0.5rem'}} disabled={loading}>
          {loading ? 'Finalizando...' : 'Finalizar Compra'}
        </button>
      </div>
    </form>
  );
};

const FaqItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="faq-item">
        <button onClick={() => setIsOpen(!isOpen)} className="faq-question">
          <span>{q}</span>
          <span className="faq-icon" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
        </button>
        <div className="faq-answer-container" style={{ maxHeight: isOpen ? '10rem' : '0' }}>
          <p className="faq-answer">{a}</p>
        </div>
      </div>
    );
};

export default function Home({ initialSoldTickets }) {
  const [soldTickets, setSoldTickets] = useState(initialSoldTickets);
  const [selectedTickets, setSelectedTickets] = useState([]);
  
  const prizeDetails = [ "3 peluqueros activos", "3 sillones de barbero", "3 estaciones de productos", "6 espejos", "7 lámparas LED", "Aire acondicionado 18,000 BTU", "Freezer para 10 cajas de cerveza", "Inversor con 2 baterías", "2 abanicos", "Asiento fijo para 12 clientes", "Asiento móvil para 4 personas", "Mesa de bar", "Tramería para exhibir bebidas" ];
  const faqs = [ {q: '¿Cómo sé que mi boleto fue registrado?', a: 'Recibirás una notificación y verás tu número marcado como vendido en la tabla en tiempo real.'}, {q: '¿Cuándo se realizará la rifa?', a: 'La rifa será en vivo en la sección "Ver Sorteo" al venderse los 500 boletos o al llegar la fecha límite.'}, {q: '¿Cómo elijo mis boletos?', a: 'Haz clic en todos los números que desees en la tabla. Puedes comprar varios a la vez.'}];
  const formattedSinglePrice = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(5000);

  useEffect(() => {
    const channel = supabase.channel('public:tickets') // <-- CORREGIDO: Canal 'public:tickets'
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, // <-- CORREGIDO: tabla 'tickets'
        (payload) => {
          if (!selectedTickets.includes(payload.new.ticket_number)) { // <-- CORREGIDO: columna 'ticket_number'
            toast.success(`¡El boleto #${payload.new.ticket_number} acaba de ser comprado!`, { position: "bottom-right" });
          }
          setSoldTickets(currentSoldTickets => [...currentSoldTickets, payload.new.ticket_number]); // <-- CORREGIDO: columna 'ticket_number'
        }
      ).subscribe();
      
    return () => supabase.removeChannel(channel);
  }, [selectedTickets]);

  const handleTicketSelect = (number) => {
    setSelectedTickets(currentSelection =>
      currentSelection.includes(number)
        ? currentSelection.filter(t => t !== number)
        : [...currentSelection, number]
    );
  };
  
  const handlePurchaseComplete = (purchased) => {
    setSoldTickets(current => [...current, ...purchased]);
    setSelectedTickets([]);
  };

  return (
    <div>
      <Head>
        <title>Rifa de Barbería - Gana un Negocio Completo</title>
        <meta name="description" content="Participa en la rifa y gana una barbería totalmente equipada y lista para operar. ¡Tu oportunidad de ser tu propio jefe!" />
      </Head>

      <section className="hero-section">
        <h1 className="hero-title">Gana una Barbería Equipada</h1>
        <p className="hero-subtitle">Tu oportunidad de ser tu propio jefe. Un negocio completo y operativo puede ser tuyo por solo {formattedSinglePrice}.</p>
      </section>

      <Carousel />

      <section id="premio" className="section">
        <h2 className="section-title">Un Premio que Cambia Vidas</h2>
        <div className="card" style={{maxWidth: '56rem', margin: '0 auto'}}>
          <ul className="prize-list">{prizeDetails.map(item => <li key={item} className="prize-item"><span className="prize-icon">✓</span> {item}</li>)}</ul>
        </div>
      </section>

      <section id="comprar" className="section">
        <h2 className="section-title">Compra tu Boleto</h2>
        <p className="hero-subtitle" style={{marginBottom: '2rem'}}>Paso 1: Elige tus números de la suerte.</p>

        <TicketGrid onTicketSelect={handleTicketSelect} soldTickets={soldTickets} selectedTickets={selectedTickets} />
        
        {selectedTickets.length > 0 && (
          <div className="card" style={{maxWidth: '42rem', margin: '3rem auto 0', textAlign: 'center'}}>
            <PurchaseForm 
              selectedTickets={selectedTickets} 
              onPurchaseComplete={handlePurchaseComplete} 
            />
          </div>
        )}
      </section>
      
      <section id="faq" className="section">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <div className="card" style={{maxWidth: '48rem', margin: '0 auto', textAlign: 'left'}}>
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('tickets') // <-- CORREGIDO: tabla 'tickets'
    .select('ticket_number'); // <-- CORREGIDO: columna 'ticket_number'

  if (error) {
    console.error("Error en getServerSideProps:", error.message);
    return { props: { initialSoldTickets: [] } };
  }
  
  const initialSoldTickets = data ? data.map(t => t.ticket_number) : []; // <-- CORREGIDO: columna 'ticket_number'
  
  return {
    props: {
      initialSoldTickets,
    },
  };
}