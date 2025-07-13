import { useEffect, useState } from "react";
import type { CartItem } from "../types/product";
import { Link } from "react-router-dom";

interface PedidoCompleto {
  comprador: {
    nombre: string;
    correo: string;
    telefono: string;
  };
  productos: CartItem[];
  total: number;
  fecha: string;
}

const Gracias = () => {
  const [pedido, setPedido] = useState<PedidoCompleto | null>(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem("pedido");
    if (datosGuardados) {
      setPedido(JSON.parse(datosGuardados));
      localStorage.removeItem("pedido");
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
          ¡Gracias por tu compra!
        </h1>

        {!pedido ? (
          <p className="text-center text-gray-600">No hay datos del pedido.</p>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-700 space-y-1">
              <p><strong>Nombre:</strong> {pedido.comprador.nombre}</p>
              <p><strong>Correo:</strong> {pedido.comprador.correo}</p>
              <p><strong>Teléfono:</strong> {pedido.comprador.telefono}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              {pedido.productos.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    Gs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <p className="text-right text-lg font-bold mt-4">
                Total: Gs. {pedido.total.toLocaleString()}
              </p>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-block bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Gracias;
