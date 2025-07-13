// src/components/CarritoFlotante.tsx

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import CarritoModal from "./CarritoModal";

const CarritoFlotante = () => {
  const { carrito } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante de carrito */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          <button
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
            title="Ver carrito"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart size={24} />
          </button>

          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {carrito.length}
            </span>
          )}
        </div>
      </div>

      {/* Modal del carrito */}
      <CarritoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CarritoFlotante;
