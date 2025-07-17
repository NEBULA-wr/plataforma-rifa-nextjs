import Link from 'next/link';
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
        <p className="footer-bottom-text">© {new Date().getFullYear()} Barbería Rifa. Todos los derechos reservados.</p>
        <ul className="footer-nav">
          <li><Link href="/#comprar" className="nav-link">Comprar</Link></li>
          <li><Link href="/rifa" className="nav-link">Sorteo</Link></li>
          <li><Link href="/admin" className="footer-link">Admin</Link></li>
        </ul>
    </div>
  </footer>
);
export default Footer;