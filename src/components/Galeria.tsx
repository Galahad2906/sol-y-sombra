import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const imagenes = [
  '/assets/bastidor-rectangular.jpg',
  '/assets/bastidor-octogonal.jpg',
  '/assets/cuadro-abanicos-naturales.jpg',
  '/assets/cuadro-abstracto-rojo-dorado.jpg',
  '/assets/cuadro-silla-colores.jpg',
  '/assets/cuadro-tecnico-electronico.jpg',
];

const Galeria = () => {
  return (
    <section
      id="galeria"
      className="py-16 bg-white overflow-hidden"
      aria-labelledby="titulo-galeria"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="titulo-galeria"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10"
          data-aos="fade-up"
        >
          Trabajos reales
        </h2>

        <PhotoProvider>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {imagenes.map((src, index) => (
              <PhotoView key={index} src={src}>
                <img
                  src={src}
                  alt={`Imagen de trabajo real ${index + 1}`}
                  className="w-full h-60 sm:h-64 object-cover rounded-lg shadow-md cursor-zoom-in transition duration-300 ease-in-out hover:scale-105"
                  data-aos="zoom-in"
                  data-aos-delay={`${index * 100}`}
                />
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </div>
    </section>
  );
};

export default Galeria;
