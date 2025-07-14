// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // ✅ TOASTER DE SONNER

import Navbar from "./components/Navbar";
import Productos from "./components/Productos";
import Galeria from "./components/Galeria";
import SobreNosotros from "./components/SobreNosotros";
import BotonWhatsApp from "./components/BotonWhatsApp";
import Loader from "./components/Loader";
import Contacto from "./components/Contacto";
import CarritoFlotante from "./components/CarritoFlotante";
import Gracias from "./pages/Gracias";
import Checkout from "./pages/Checkout";
import Historial from "./pages/Historial";

function Home() {
  return (
    <div className="bg-white text-gray-900 font-sans scroll-smooth overflow-x-hidden">
      {/* ✅ Toaster de Sonner al principio del layout */}
      <Toaster richColors position="top-right" />

      <Loader />
      <Navbar />

      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-marfil px-4 py-12 md:py-20"
      >
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-snug"
          data-aos="fade-up"
        >
          Bienvenidos a Sol y Sombra SRL
        </h1>
      </section>

      <Productos />
      <Galeria />
      <SobreNosotros />
      <BotonWhatsApp />
      <Contacto />
      <CarritoFlotante />

      <footer className="text-center text-sm py-4 bg-gray-100 text-gray-600">
        © {new Date().getFullYear()} Sol y Sombra SRL. Todos los derechos reservados.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
