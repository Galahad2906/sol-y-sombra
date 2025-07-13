import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { CartProvider } from './context/CartContext';

const Main = () => {
  useEffect(() => {
    AOS.init({
      once: true, // ✅ Solo se anima una vez por elemento
      duration: 800,
      easing: 'ease-out-cubic',
    });

    // 🔧 Soluciona el doble scroll inicial forzando refresco
    setTimeout(() => {
      AOS.refreshHard();
    }, 500);
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <Main />
    </CartProvider>
  </React.StrictMode>
);
