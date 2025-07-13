// src/components/CarritoModal.tsx
import { useCart } from "../context/CartContext";
import type { CartItem, Product } from "../types/product";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CarritoModal = ({ isOpen, onClose }: Props) => {
  const { carrito, agregar, quitar, limpiar, total } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const toProduct = (item: CartItem): Product => {
    const { quantity, ...product } = item;
    return product;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h3 className="text-xl font-bold mb-4">Carrito</h3>

        {carrito.length === 0 ? (
          <p className="text-gray-600">No hay productos en el carrito.</p>
        ) : (
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {carrito.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 border-b pb-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.category} – Gs. {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => quitar(item.id)}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => agregar(toProduct(item))}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Subtotal: Gs. {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {item.quantity === 1 && (
                    <button
                      onClick={() => quitar(item.id)}
                      className="text-red-500 text-xs mt-1 hover:underline"
                    >
                      Quitar del carrito
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {carrito.length > 0 && (
          <div className="mt-6">
            <div className="text-right font-semibold text-gray-800 text-lg mb-4">
              Total: Gs. {total.toLocaleString()}
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={limpiar}
                className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition"
              >
                Vaciar carrito
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoModal;
