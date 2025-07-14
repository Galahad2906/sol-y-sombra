import { useEffect, useState } from "react";
import type { CartItem } from "../types/product";

interface PedidoCompleto {
  comprador?: {
    nombre?: string;
    correo?: string;
    telefono?: string;
  };
  productos: CartItem[];
  total: number;
  fecha: string;
}

const Historial = () => {
  const [historial, setHistorial] = useState<PedidoCompleto[]>([]);

  useEffect(() => {
    const datos = localStorage.getItem("historialPedidos");
    if (datos) {
      try {
        const parseado = JSON.parse(datos);
        if (Array.isArray(parseado)) setHistorial(parseado);
      } catch {
        console.error("Error al parsear historial.");
      }
    }
  }, []);

  const historialFiltrado = historial.filter((p) => p.comprador);

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Historial de Pedidos
        </h1>

        {historialFiltrado.length === 0 ? (
          <p className="text-center text-gray-500">No hay pedidos registrados.</p>
        ) : (
          <div className="space-y-8">
            {historialFiltrado.map((pedido, index) => (
              <div key={index} className="border-b pb-4">
                <div className="text-sm text-gray-700 mb-2 space-y-1">
                  <p><strong>Nombre:</strong> {pedido.comprador?.nombre ?? "Sin nombre"}</p>
                  <p><strong>Correo:</strong> {pedido.comprador?.correo ?? "Sin correo"}</p>
                  <p><strong>Teléfono:</strong> {pedido.comprador?.telefono ?? "Sin teléfono"}</p>
                  <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                </div>

                <div className="mt-2 space-y-1">
                  {pedido.productos.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-800"
                    >
                      <span>{item.title} × {item.quantity}</span>
                      <span>Gs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <p className="text-right font-bold text-gray-900 mt-2">
                  Total: Gs. {pedido.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Historial;
