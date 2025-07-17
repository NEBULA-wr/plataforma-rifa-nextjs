import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile && !vantaEffect && window.VANTA) {
      const vantaInstance = window.VANTA.NET({
          el: vantaRef.current, mouseControls: true, touchControls: true, gyroControls: false,
          minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
          color: 0x3f8eff, backgroundColor: 0x20617, points: 10.00, maxDistance: 22.00, spacing: 18.00
      });
      setVantaEffect(vantaInstance);
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  return (
    <>
      <div id="vanta-bg" ref={vantaRef}></div>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    </>
  );
};
export default Layout;