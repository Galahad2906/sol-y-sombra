const SobreNosotros = () => {
  return (
    <section
      id="nosotros"
      className="py-12 sm:py-20 bg-marfil overflow-hidden" // ✅ agregado
      aria-label="Sección sobre nosotros"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div data-aos="fade-right">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Sobre Nosotros</h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
            En <strong>Sol y Sombra SRL</strong> nos especializamos en el arte de enmarcar, restaurar y embellecer obras. 
            Somos un equipo apasionado que cuida cada detalle del proceso, desde la elección de materiales hasta la presentación final. 
            Nuestro compromiso es ofrecer un trabajo artesanal de calidad que realce el valor de cada pieza.
          </p>

          <p
            className="italic text-gray-700 mt-6 text-base sm:text-lg font-serif"
            data-aos="fade-up"
          >
            “Cada obra enmarcada es una historia que cuidamos con nuestras manos.”
          </p>

          <p
            className="text-right text-sm text-gray-500 mt-2"
            data-aos="fade-up"
          >
            — El equipo de Sol y Sombra
          </p>
        </div>

        {/* Imagen real del taller */}
        <div data-aos="fade-left" className="flex justify-center">
          <div className="bg-white p-3 border-[8px] sm:border-[10px] border-gray-300 shadow-lg rounded-md box-border">
            <img
              src="/assets/sobre-nosotros.jpg"
              alt="Taller Sol y Sombra"
              className="w-full h-auto max-w-md rounded-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
