import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { carrito, total, limpiar } = useCart();
  const navigate = useNavigate();

  const [tipoCliente, setTipoCliente] = useState<"fisica" | "juridica">("fisica");
  const [requiereFactura, setRequiereFactura] = useState(false);

  const [datos, setDatos] = useState({
    nombre: "",
    cedula: "",
    razonSocial: "",
    ruc: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const errores: string[] = [];

    if (tipoCliente === "fisica") {
      if (!datos.nombre.trim()) errores.push("Nombre completo requerido.");
      if (!datos.cedula.trim()) errores.push("Cédula requerida.");
    } else {
      if (!datos.razonSocial.trim()) errores.push("Razón social requerida.");
      if (!datos.ruc.trim()) errores.push("RUC requerido.");
    }

    if (!datos.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
      errores.push("Correo inválido.");
    }

    if (!datos.telefono.trim() || !/^\d+$/.test(datos.telefono)) {
      errores.push("Teléfono inválido.");
    }

    if (!datos.direccion.trim()) errores.push("Dirección requerida.");
    if (!datos.ciudad.trim()) errores.push("Ciudad requerida.");
    if (!datos.departamento.trim()) errores.push("Departamento requerido.");

    if (errores.length > 0) {
      toast.error(errores[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const pedido = {
      tipoCliente,
      requiereFactura,
      datos,
      productos: carrito,
      total,
      fecha: new Date().toISOString(),
    };

    const historial = JSON.parse(localStorage.getItem("historialPedidos") || "[]");
    historial.push(pedido);
    localStorage.setItem("historialPedidos", JSON.stringify(historial));
    localStorage.setItem("pedido", JSON.stringify(pedido));

    toast.success("¡Compra confirmada!");
    limpiar();
    navigate("/gracias");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Finalizar compra</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de cliente */}
          <div>
            <label className="block font-semibold mb-1">Tipo de Cliente</label>
            <select
              name="tipoCliente"
              value={tipoCliente}
              onChange={(e) => setTipoCliente(e.target.value as "fisica" | "juridica")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="fisica">Persona física</option>
              <option value="juridica">Persona jurídica</option>
            </select>
          </div>

          {/* Campos según tipo */}
          {tipoCliente === "fisica" ? (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={datos.nombre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="cedula"
                placeholder="Cédula de identidad"
                value={datos.cedula}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="razonSocial"
                placeholder="Razón social"
                value={datos.razonSocial}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="ruc"
                placeholder="RUC"
                value={datos.ruc}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </>
          )}

          {/* Campos comunes */}
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={datos.correo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            inputMode="numeric"
            pattern="[0-9]*"
            value={datos.telefono}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={datos.direccion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={datos.ciudad}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="departamento"
            placeholder="Departamento"
            value={datos.departamento}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          {/* Factura electrónica */}
          <div className="mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={requiereFactura}
                onChange={(e) => setRequiereFactura(e.target.checked)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700 font-medium">Solicitar factura electrónica</span>
            </label>
          </div>

          {/* Resumen de carrito */}
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Resumen:</h3>
            {carrito.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.title} × {item.quantity}</span>
                <span>Gs. {(item.price * item.quantity).toLocaleString()}</span>
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
            Confirmar compra
          </button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
