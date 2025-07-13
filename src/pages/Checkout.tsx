import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../types/product";

const Checkout = () => {
  const { carrito, total, limpiar } = useCart();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  const handleConfirmar = () => {
    if (!nombre || !correo || !telefono) {
      setError("Por favor completá todos los campos.");
      return;
    }

    const nuevoPedido = {
      comprador: { nombre, correo, telefono },
      productos: carrito,
      total,
      fecha: new Date().toISOString(),
    };

    const historial = JSON.parse(localStorage.getItem("historialPedidos") || "[]");
    historial.push(nuevoPedido);
    localStorage.setItem("historialPedidos", JSON.stringify(historial));
    localStorage.setItem("pedido", JSON.stringify(nuevoPedido));

    limpiar();
    navigate("/gracias");
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Finalizar Compra</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmar();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="pt-4">
            <h3 className="font-semibold mb-2">Resumen:</h3>
            {carrito.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>
                  Gs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <p className="text-right font-bold mt-2">
              Total: Gs. {total.toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Confirmar Compra
          </button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
