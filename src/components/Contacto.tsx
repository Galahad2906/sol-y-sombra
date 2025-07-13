// src/components/Contacto.tsx
import React from "react";

const Contacto: React.FC = () => {
  return (
    <section
      id="contacto"
      aria-labelledby="titulo-contacto"
      className="px-6 py-16 bg-marfil text-gray-800"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="titulo-contacto"
          className="text-3xl font-semibold mb-6 text-center"
        >
          Contactanos
        </h2>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Mensaje enviado!");
          }}
        >
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block mb-1 font-medium">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              aria-label="Nombre completo"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              aria-label="Correo electrónico"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="mensaje" className="block mb-1 font-medium">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              aria-label="Mensaje"
              rows={5}
              required
              className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-800"
            ></textarea>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacto;
