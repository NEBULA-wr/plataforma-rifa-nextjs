import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = 'auto'; }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <nav className="navbar">
        <Link href="/" className="navbar-brand">Barbería Rifa</Link>
        <div className="nav-links-desktop">
          <Link href="/#comprar" className="nav-link">Comprar Boleto</Link>
          <Link href="/rifa" className="nav-link">Ver Sorteo</Link>
          <Link href="/#faq" className="nav-link">Preguntas</Link>
        </div>
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(true)}>
          <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-700)'}}>
            <button className="mobile-menu-button" onClick={() => setIsMenuOpen(false)}>
                <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <Link href="/#comprar" className="nav-link" onClick={() => setIsMenuOpen(false)}>Comprar Boleto</Link>
          <Link href="/#premio" className="nav-link" onClick={() => setIsMenuOpen(false)}>El Premio</Link>
          <Link href="/rifa" className="nav-link" onClick={() => setIsMenuOpen(false)}>Ver Sorteo</Link>
          <Link href="/#faq" className="nav-link" onClick={() => setIsMenuOpen(false)}>Preguntas Frecuentes</Link>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;