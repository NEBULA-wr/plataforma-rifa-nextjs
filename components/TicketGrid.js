// components/TicketGrid.js

import { useState } from 'react';

const Ticket = ({ number, status, onSelect, isSelected }) => {
  let ticketClass = 'ticket';
  if (status === 'available') {
    ticketClass += ' ticket-available';
    if (isSelected) {
      ticketClass += ' ticket-selected';
    }
  } else {
    ticketClass += ' ticket-sold';
  }

  return (
    <div className={ticketClass} onClick={() => status === 'available' && onSelect(number)}>
      {String(number).padStart(3, '0')}
    </div>
  );
};

const TicketGrid = ({ onTicketSelect, soldTickets = [], selectedTickets = [] }) => {
  const [filter, setFilter] = useState('all');
  
  const tickets = Array.from({ length: 500 }, (_, i) => i + 1);

  const filteredTickets = tickets.filter(t => {
      const isSold = soldTickets.includes(t);
      if (filter === 'sold') return isSold;
      if (filter === 'available') return !isSold;
      return true; // 'all'
  });

  const getFilterStyle = (filterName) => {
      return filter === filterName ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--slate-700)' };
  };

  return (
    <div className="card ticket-grid-container">
      <div className="ticket-grid-filters">
          <button onClick={() => setFilter('all')} style={getFilterStyle('all')}>Todos</button>
          <button onClick={() => setFilter('available')} style={getFilterStyle('available')}>Disponibles</button>
          <button onClick={() => setFilter('sold')} style={getFilterStyle('sold')}>Vendidos</button>
      </div>
      <div className="ticket-grid">
        {filteredTickets.map(number => (
          <Ticket
            key={number}
            number={number}
            status={soldTickets.includes(number) ? 'sold' : 'available'}
            onSelect={onTicketSelect}
            isSelected={selectedTickets.includes(number)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketGrid;