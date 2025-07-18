// components/Navbar.js
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Función para cerrar el menú, útil para los enlaces
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <nav className="navbar">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          Barbería Rifa
        </Link>
        
        {/* --- Menú de Escritorio (Controlado por CSS) --- */}
        <div className="nav-links-desktop">
          <Link href="/#comprar" className="nav-link">Comprar Boleto</Link>
          <Link href="/rifa" className="nav-link">Ver Sorteo</Link>
          <Link href="/#faq" className="nav-link">Preguntas</Link>
        </div>

        {/* --- Menú Móvil (Controlado por React y CSS) --- */}
        {/* Panel del Menú Lateral */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            {/* Botón de CERRAR (la X) */}
            <button className="mobile-menu-button" onClick={closeMenu}>
              <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <Link href="/#comprar" className="nav-link" onClick={closeMenu}>Comprar Boleto</Link>
          <Link href="/#premio" className="nav-link" onClick={closeMenu}>El Premio</Link>
          <Link href="/rifa" className="nav-link" onClick={closeMenu}>Ver Sorteo</Link>
          <Link href="/#faq" className="nav-link" onClick={closeMenu}>Preguntas Frecuentes</Link>
        </div>

        {/* Botón para ABRIR (hamburguesa) - Se muestra solo si el menú está cerrado */}
        {!isMenuOpen && (
          <button className="mobile-menu-button" onClick={() => setIsMenuOpen(true)}>
            <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;