import Navbar from "./components/Navbar";
import Productos from "./components/Productos";
import Galeria from "./components/Galeria";
import SobreNosotros from "./components/SobreNosotros";
import BotonWhatsApp from "./components/BotonWhatsApp";
import Loader from "./components/Loader";
import Contacto from "./components/Contacto";
import CarritoFlotante from "./components/CarritoFlotante";


function App() {
  return (
    <div className="bg-white text-gray-900 font-sans scroll-smooth overflow-x-hidden">
      {/* Loader inicial */}
      <Loader />

      {/* Barra de navegación */}
      <Navbar />

      {/* Sección Hero */}
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

      {/* Sección de productos */}
      <Productos />

      {/* Galería de trabajos */}
      <Galeria />

      {/* Sobre nosotros */}
      <SobreNosotros />

      {/* Botón flotante de WhatsApp */}
      <BotonWhatsApp />

      {/* Contacto */}
      <Contacto />
<CarritoFlotante />

      {/* Footer */}
      <footer className="text-center text-sm py-4 bg-gray-100 text-gray-600">
        © {new Date().getFullYear()} Sol y Sombra SRL. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;
