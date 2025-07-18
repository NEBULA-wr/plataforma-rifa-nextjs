// components/Layout.js

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    // No necesitamos divs extra para el fondo, el CSS se aplicará directamente
    // al body y a la clase .app-layout
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;