// src/components/Productos.tsx
import { useState } from "react";
import { products } from "../data/products";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const Productos = () => {
  const { agregar } = useCart();
  const [clickedId, setClickedId] = useState<number | null>(null);

  const handleClick = (product: Product) => {
    agregar(product);
    setClickedId(product.id);
    toast.success(`${product.title} añadido al carrito`);
    setTimeout(() => setClickedId(null), 300);
  };

  return (
    <section
      id="productos"
      className="py-12 sm:py-16 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10"
          data-aos="fade-up"
        >
          Nuestros Productos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              data-aos="fade-up"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 sm:h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 break-words">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-sm text-gray-800 font-bold mt-2">
                  Gs. {product.price.toLocaleString()}
                </p>

                <button
                  onClick={() => handleClick(product)}
                  className={`mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition transform ${
                    clickedId === product.id ? "animate-pulse-once" : ""
                  }`}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Productos;
