import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } text-gray-800 overflow-x-hidden`}
      role="navigation"
      aria-label="Menú principal"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-3 flex justify-between items-center">
        <a
          href="#hero"
          className="text-lg sm:text-xl font-semibold tracking-wide"
        >
          Sol y Sombra
        </a>

        {/* Menú en desktop */}
        <div className="space-x-4 hidden md:flex text-base sm:text-lg">
          <a href="#productos" className="hover:text-marfil transition-colors">Productos</a>
          <a href="#galeria" className="hover:text-marfil transition-colors">Galería</a>
          <a href="#nosotros" className="hover:text-marfil transition-colors">Sobre Nosotros</a>
          <a href="#contacto" className="hover:text-marfil transition-colors">Contacto</a>
          <a href="/historial" className="hover:text-green-700 transition-colors">Historial</a> {/* 👈 Nuevo enlace */}
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center focus:outline-none text-gray-800"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md w-full overflow-x-hidden">
          <div className="flex flex-col items-center gap-4 py-4 text-base">
            <a href="#productos" onClick={() => setMenuOpen(false)} className="hover:text-marfil">Productos</a>
            <a href="#galeria" onClick={() => setMenuOpen(false)} className="hover:text-marfil">Galería</a>
            <a href="#nosotros" onClick={() => setMenuOpen(false)} className="hover:text-marfil">Sobre Nosotros</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)} className="hover:text-marfil">Contacto</a>
            <a href="/historial" onClick={() => setMenuOpen(false)} className="hover:text-green-700">Historial</a> {/* 👈 Nuevo */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
