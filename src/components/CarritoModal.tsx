// src/components/CarritoModal.tsx
import { useCart } from "../context/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CarritoModal = ({ isOpen, onClose }: Props) => {
  const { carrito, quitar } = useCart(); // 👈 usar la función correcta

  if (!isOpen) return null;

  const total = carrito.reduce((sum, item) => sum + item.price, 0);

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
              <li key={item.id} className="flex items-center gap-4 border-b pb-3">
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
                </div>
                <button
                  onClick={() => quitar(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        {carrito.length > 0 && (
          <div className="mt-6 text-right font-semibold text-gray-700">
            Total: Gs. {total.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoModal;
