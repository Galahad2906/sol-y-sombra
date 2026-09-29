import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpData } from '../context/ErpDataContext';
import { calculateFramePrice, GLASS_TYPES, PAYMENT_METHODS, formatCurrency } from '../../services/pricingService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ErpHelpTooltip from '../components/ErpHelpTooltip';
import {
  Plus,
  Search,
  FileText,
  Download,
  Calendar,
  DollarSign,
  Layers,
  X,
  MessageCircle,
  Clock,
  CheckCircle,
  Printer,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';

const ErpOrders = () => {
  const { orders, customers, inventory, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useErpData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleSaveEditOrder = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    const newDep = parseFloat(editingOrder.deposit) || 0;
    const newBal = Math.max(0, (editingOrder.totalPrice || 0) - newDep);
    updateOrder(editingOrder.id, {
      title: editingOrder.title,
      deposit: newDep,
      balance: newBal,
      promiseDate: editingOrder.promiseDate,
      status: editingOrder.status
    });
    if (selectedOrder && selectedOrder.id === editingOrder.id) {
      setSelectedOrder({ ...selectedOrder, ...editingOrder, deposit: newDep, balance: newBal });
    }
    setEditingOrder(null);
  };

  // Modal for new order
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(
    searchParams.get('action') === 'new'
  );

  // New Order Form state
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    customCustomerName: '',
    title: '',
    widthM: '0.50',
    heightM: '0.70',
    moldingId: 'inv-m03',
    glassType: 'sencillo',
    paymentMethod: 'transferencia',
    deposit: '',
    promiseDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    createTrelloCard: true
  });

  // Available molduras from inventory
  const availableMolduras = useMemo(() => {
    return inventory.filter(i => i.category === 'moldura');
  }, [inventory]);

  const selectedMoldura = useMemo(() => {
    return availableMolduras.find(m => m.id === formData.moldingId) || availableMolduras[0];
  }, [availableMolduras, formData.moldingId]);

  // Real-time calculation using pricingService
  const calculation = useMemo(() => {
    const w = parseFloat(formData.widthM) || 0;
    const h = parseFloat(formData.heightM) || 0;
    const mPrice = selectedMoldura ? selectedMoldura.salePricePerMeter : 75000;

    if (w <= 0 || h <= 0) return null;

    return calculateFramePrice(w, h, mPrice, formData.glassType, formData.paymentMethod);
  }, [formData.widthM, formData.heightM, selectedMoldura, formData.glassType, formData.paymentMethod]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.moldingCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'todos' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!calculation) return;

    let custName = formData.customCustomerName;
    const existingCust = customers.find(c => c.id === formData.customerId);
    if (existingCust && !custName) {
      custName = existingCust.name;
    }

    const selectedGlassObj = Object.values(GLASS_TYPES).find(g => g.id === formData.glassType);

    const newOrder = addOrder({
      customerId: formData.customerId,
      customerName: custName || 'Cliente Mostrador',
      title: formData.title || `Enmarcado ${formData.widthM}x${formData.heightM}m (${selectedMoldura.code})`,
      widthM: formData.widthM,
      heightM: formData.heightM,
      moldingCode: selectedMoldura.code,
      moldingName: selectedMoldura.name,
      moldingPrice: selectedMoldura.salePricePerMeter,
      glassType: formData.glassType,
      glassName: selectedGlassObj?.name || 'Vidrio Estándar',
      paymentMethod: formData.paymentMethod,
      totalPrice: calculation.prices.final,
      deposit: formData.deposit ? parseFloat(formData.deposit) : Math.round(calculation.prices.final * 0.5),
      promiseDate: formData.promiseDate
    }, formData.createTrelloCard);

    setIsNewOrderModalOpen(false);
    if (searchParams.get('action') === 'new') {
      setSearchParams({});
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'presupuesto':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
            Presupuesto
          </span>
        );
      case 'produccion':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            En Taller / Producción
          </span>
        );
      case 'listo':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Listo para Retiro
          </span>
        );
      case 'entregado':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Entregado & Concretado
          </span>
        );
      default:
        return null;
    }
  };

  // Generate official Workshop & Customer Order Sheet PDF
  const generateOrderPDF = (order) => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(230, 185, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SOL & SOMBRA S.R.L.", 15, 16);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("ENMARCADOS DE ALTA GAMA & MARQUETERÍA FINA", 15, 23);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`ORDEN DE TRABAJO: ${order.id}`, 195, 16, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`Fecha: ${order.date} | Entrega Pactada: ${order.promiseDate}`, 195, 23, { align: "right" });

    // Client Info Box
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE Y TRABAJO", 15, 45);

    const clientRows = [
      ["Cliente:", order.customerName, "Teléfono:", "+595 981 000 000"],
      ["Descripción:", order.title, "Estado Actual:", order.status.toUpperCase()]
    ];

    autoTable(doc, {
      startY: 48,
      body: clientRows,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 }
    });

    // Specifications for Workshop
    const perimeter = ((order.widthM + order.heightM) * 2).toFixed(2);
    const area = (order.widthM * order.heightM).toFixed(2);

    const specRows = [
      ["Medidas Interiores (Luz)", `${order.widthM} m (ancho) x ${order.heightM} m (alto)`],
      ["Perímetro de Corte Moldura", `${perimeter} metros lineales`],
      ["Moldura Seleccionada", `${order.moldingCode} - ${order.moldingName}`],
      ["Tipo de Cristal / Vidrio", `${order.glassName} (${area} m²)`],
      ["Fondo y Sellado", "MDF 3mm + Cinta engomada kraft antihumedad + Colgador"],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Especificación Técnica de Taller", "Detalle"]],
      body: specRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    // Financial breakdown
    const finRows = [
      ["Total Presupuesto (IVA Inc.):", formatCurrency(order.totalPrice)],
      ["Seña / Anticipo Percibido:", formatCurrency(order.deposit)],
      [{ content: "SALDO PENDIENTE A LA ENTREGA:", styles: { fontStyle: 'bold' } }, { content: formatCurrency(order.balance), styles: { fontStyle: 'bold', textColor: [200, 40, 40] } }],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Resumen Financiero", "Monto"]],
      body: finRows,
      theme: 'grid',
      headStyles: { fillColor: [181, 146, 78], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // Signature boxes
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, finalY, 85, finalY);
    doc.line(125, finalY, 190, finalY);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Firma Encargado de Taller", 35, finalY + 5);
    doc.text("Conformidad del Cliente / Retiro", 137, finalY + 5);

    doc.save(`Sol_y_Sombra_${order.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Gestión de Pedidos & Cotizador
            </h1>
            <ErpHelpTooltip
              title="Cotizaciones y Órdenes de Trabajo"
              description="Calcula medidas, perímetros de moldura y m² de cristal automáticamente según la lista de precios oficial de Sol & Sombra."
              steps={[
                "Haz clic en 'Nueva Cotización / Orden' para calcular un enmarcado ingresando alto y ancho en metros.",
                "El sistema calculará el costo de moldura + cristal + IVA (10%) y el saldo restante.",
                "Haz clic en 'PDF' para descargar la hoja técnica con medidas para los operarios de taller.",
                "Haz clic sobre cualquier orden para ver su detalle completo, modificarla o eliminarla."
              ]}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">
            Cálculo de medidas, molduras, vidrios, precios y emisión de órdenes de trabajo.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 shrink-0"
        >
          <Plus size={18} />
          Nueva Cotización / Orden
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número de orden, cliente, o moldura..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="todos">Todos los pedidos</option>
            <option value="presupuesto">Presupuestos</option>
            <option value="produccion">En Producción</option>
            <option value="listo">Listos para Retiro</option>
            <option value="entregado">Entregados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-3 px-4">Orden / Fecha</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Especificación</th>
                <th className="py-3 px-4">Medidas</th>
                <th className="py-3 px-4 text-right">Monto Total</th>
                <th className="py-3 px-4 text-right">Saldo Pendiente</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 text-sm italic">
                    No se encontraron órdenes ni presupuestos con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`hover:bg-neutral-800/40 transition-colors cursor-pointer ${order.isExample ? 'opacity-85' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <div className="font-bold text-amber-400">{order.id}</div>
                        {order.isExample && (
                          <span className="px-1 py-0.2 rounded bg-neutral-800 text-neutral-500 font-mono text-[9px] border border-neutral-700">
                            Ejemplo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        <span>{order.date}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-200">{order.customerName}</div>
                      <div className="text-xs text-neutral-400 truncate max-w-[180px]">{order.title}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-neutral-300">
                        {order.moldingCode}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
                        {order.glassName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-neutral-300">
                      {order.widthM}m x {order.heightM}m
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-200">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      {order.balance > 0 ? (
                        <span className="text-rose-400 font-semibold">
                          {formatCurrency(order.balance)}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-xs">
                          Pagado 100%
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="presupuesto">Presupuesto</option>
                        <option value="produccion">En Producción</option>
                        <option value="listo">Listo para Retiro</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => generateOrderPDF(order)}
                          title="Descargar Orden de Taller / Ticket PDF"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors inline-flex items-center gap-1 text-xs"
                        >
                          <Printer size={14} />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => setEditingOrder(order)}
                          title="Modificar orden"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la orden ${order.id}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          title="Eliminar orden"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW ORDER / CALCULATOR MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  Nueva Orden de Trabajo & Cotización
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Calculadora integrada con precios de moldura, m² de cristal e insumos.
                </p>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 mt-5">
              {/* Customer Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Seleccionar Cliente
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </option>
                    ))}
                    <option value="">+ Nuevo Cliente Manual</option>
                  </select>
                </div>

                {!formData.customerId && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nombre del Cliente Nuevo
                    </label>
                    <input
                      type="text"
                      placeholder="ej. Arq. Marcelo Ramos"
                      value={formData.customCustomerName}
                      onChange={(e) => setFormData({ ...formData, customCustomerName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Descripción / Título de la Obra
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Fotografía Artística Blanco y Negro"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">
                  Dimensiones de la Luz Interior
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Ancho (metros)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.widthM}
                      onChange={(e) => setFormData({ ...formData, widthM: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Alto (metros)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.heightM}
                      onChange={(e) => setFormData({ ...formData, heightM: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Moldura and Glass Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Moldura del Catálogo
                  </label>
                  <select
                    value={formData.moldingId}
                    onChange={(e) => setFormData({ ...formData, moldingId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {availableMolduras.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.code} - {m.name} ({formatCurrency(m.salePricePerMeter)}/m)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tipo de Vidrio / Cristal
                  </label>
                  <select
                    value={formData.glassType}
                    onChange={(e) => setFormData({ ...formData, glassType: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {Object.values(GLASS_TYPES).map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({formatCurrency(g.pricePerM2)}/m²)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method and Promise Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Forma de Pago
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {Object.values(PAYMENT_METHODS).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Fecha Prometida de Entrega
                  </label>
                  <input
                    type="date"
                    value={formData.promiseDate}
                    onChange={(e) => setFormData({ ...formData, promiseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Live Calculation Results Box */}
              {calculation && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-2.5">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Perímetro: {calculation.dimensions.perimeter.toFixed(2)} m</span>
                    <span>Área Cristal: {calculation.dimensions.area.toFixed(2)} m²</span>
                  </div>

                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Costo Moldura + Vidrio:</span>
                    <span className="font-mono">{formatCurrency(calculation.costs.materialSubtotal)}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                      Precio Total Final (IVA Inc.):
                    </span>
                    <span className="text-xl font-bold font-mono text-white">
                      {formatCurrency(calculation.prices.final)}
                    </span>
                  </div>

                  {/* Seña Input */}
                  <div className="pt-2 border-t border-neutral-900 grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Seña / Anticipo Pagado (Gs):
                      </label>
                      <input
                        type="number"
                        placeholder={String(Math.round(calculation.prices.final * 0.5))}
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-100"
                      />
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-neutral-400">Saldo a Cobrar:</span>
                      <div className="text-sm font-mono font-bold text-rose-400">
                        {formatCurrency(
                          Math.max(
                            0,
                            calculation.prices.final -
                              (formData.deposit ? parseFloat(formData.deposit) : Math.round(calculation.prices.final * 0.5))
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trello integration checkbox */}
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.createTrelloCard}
                  onChange={(e) => setFormData({ ...formData, createTrelloCard: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900"
                />
                <span>Enviar automáticamente orden al Tablero Trello de taller</span>
              </label>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
                >
                  Guardar y Emitir Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELECTED ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-white font-serif mt-1">
                  {selectedOrder.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Cliente: <span className="text-neutral-200 font-semibold">{selectedOrder.customerName}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs text-neutral-300">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-neutral-500 uppercase font-mono text-[10px]">Medidas de la Obra</span>
                  <div className="font-semibold text-neutral-200 mt-0.5">{selectedOrder.widthM}m x {selectedOrder.heightM}m</div>
                  <div className="text-neutral-400 text-[11px]">Perímetro: {((selectedOrder.widthM + selectedOrder.heightM) * 2).toFixed(2)}m</div>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase font-mono text-[10px]">Moldura & Cristal</span>
                  <div className="font-semibold text-amber-400 mt-0.5">{selectedOrder.moldingCode}</div>
                  <div className="text-neutral-400 text-[11px] truncate">{selectedOrder.glassName}</div>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Presupuesto (IVA Inc.):</span>
                  <span className="font-mono font-bold text-white text-sm">{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Seña / Anticipo:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(selectedOrder.deposit)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-900">
                  <span className="text-neutral-300 font-bold">Saldo Pendiente de Cobro:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">{formatCurrency(selectedOrder.balance)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Fecha Pactada de Entrega: <strong className="text-neutral-200">{selectedOrder.promiseDate}</strong></span>
                <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar la orden ${selectedOrder.id}?`)) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-colors"
              >
                Eliminar Orden
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(selectedOrder)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Modificar</span>
                </button>
                <button
                  type="button"
                  onClick={() => generateOrderPDF(selectedOrder)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={15} />
                  <span>Descargar Hoja PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Modificar Orden: {editingOrder.id}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Descripción / Título de la Obra</label>
                <input
                  type="text"
                  required
                  value={editingOrder.title}
                  onChange={(e) => setEditingOrder({ ...editingOrder, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Monto Total Presupuestado (Gs)</label>
                  <input
                    type="number"
                    disabled
                    value={editingOrder.totalPrice}
                    className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Seña / Anticipo Pagado (Gs)</label>
                  <input
                    type="number"
                    required
                    value={editingOrder.deposit}
                    onChange={(e) => setEditingOrder({ ...editingOrder, deposit: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Fecha Prometida de Entrega</label>
                  <input
                    type="date"
                    required
                    value={editingOrder.promiseDate}
                    onChange={(e) => setEditingOrder({ ...editingOrder, promiseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Estado de la Orden</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="presupuesto">Presupuesto</option>
                    <option value="produccion">En Producción</option>
                    <option value="listo">Listo para Retiro</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpOrders;
