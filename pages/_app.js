// pages/_app.js

import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import { RaffleProvider } from '../components/context/RaffleContext'; // <-- Importamos el cerebro
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    // Envolvemos todo con el RaffleProvider
    <RaffleProvider>
      <Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: '',
            duration: 5000,
            style: { background: '#334155', color: '#fff' },
          }}
        />
        <Component {...pageProps} />
      </Layout>
    </RaffleProvider>
  );
}

export default MyApp;