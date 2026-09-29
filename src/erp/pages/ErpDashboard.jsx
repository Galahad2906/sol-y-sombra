import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useErpAuth } from '../context/ErpAuthContext';
import { useErpData } from '../context/ErpDataContext';
import { formatCurrency } from '../../services/pricingService';
import ErpHelpTooltip from '../components/ErpHelpTooltip';
import {
  TrendingUp,
  Kanban,
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Boxes,
  Users,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  Hammer,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const ErpDashboard = () => {
  const { user } = useErpAuth();
  const { orders, trelloCards, inventory, customers, transactions, hasDemoData, clearAllDemoData, resetToDefaults } = useErpData();

  // Metrics calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalCollected = transactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const pendingCollection = orders.reduce((sum, o) => sum + (o.balance || 0), 0);
    const inProductionCount = orders.filter(o => o.status === 'produccion').length;
    const readyForPickupCount = orders.filter(o => o.status === 'listo').length;
    const lowStockCount = inventory.filter(i => i.stockMeters <= i.minStockMeters).length;

    return {
      totalRevenue,
      totalCollected,
      pendingCollection,
      inProductionCount,
      readyForPickupCount,
      lowStockCount
    };
  }, [orders, transactions, inventory]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const urgentTrelloTasks = useMemo(() => {
    return trelloCards
      .filter(c => c.priority === 'urgente' || c.priority === 'alta')
      .slice(0, 4);
  }, [trelloCards]);

  const criticalInventory = useMemo(() => {
    return inventory.filter(i => i.stockMeters <= i.minStockMeters);
  }, [inventory]);

  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      {hasDemoData && (
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300 font-semibold">Datos de demostración activos:</strong> Los registros marcados con <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px] border border-neutral-700">Ejemplo</span> son solo de guía. Puedes cambiarlos, borrarlos o vaciarlos cuando desees.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (confirm('¿Deseas vaciar todos los registros de ejemplo para empezar a cargar los datos reales en blanco?')) {
                  clearAllDemoData();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors text-xs font-medium"
            >
              Vaciar ejemplos para empezar de cero
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                Sol & Sombra SRL — Resumen Ejecutivo
              </span>
              <ErpHelpTooltip
                title="Panel de Control General"
                description="Aquí ves el pulso operativo de tu empresa en tiempo real: dinero cobrado en caja, cuadros en proceso, pedidos listos y alertas de materiales."
                steps={[
                  "Revisa las 4 tarjetas superiores para ver el flujo financiero y de taller.",
                  "Haz clic en 'Abrir Tablero Trello' para organizar el taller por columnas.",
                  "Haz clic en 'Cotizar' para presupuestar un cuadro y emitir la orden en PDF."
                ]}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1">
              Hola, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Panel general de control operativo. Monitorea los trabajos activos en taller, ingresos por señas y disponibilidad de molduras.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/erp/trello"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all active:scale-98"
            >
              <Kanban size={16} />
              <span>Abrir Tablero Trello</span>
            </NavLink>

            <NavLink
              to="/erp/pedidos?action=new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-all"
            >
              <PlusCircle size={16} className="text-amber-400" />
              <span>Cotizar</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Cobrado en Caja</span>
              <ErpHelpTooltip
                title="Cobrado en Caja"
                description="Muestra el total de dinero percibido efectivamente (señas y cancelaciones) en Guaraníes."
                steps={[
                  "Cada vez que emites una orden con seña o registras un cobro en 'Caja', este valor aumenta.",
                  "Abajo ves el monto que todavía resta cobrar a los clientes."
                ]}
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(metrics.totalCollected)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold font-mono">
              {formatCurrency(metrics.pendingCollection)}
            </span>
            <span>en saldos a cobrar</span>
          </div>
        </div>

        {/* In Production */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">En Producción</span>
              <ErpHelpTooltip
                title="Trabajos en Producción"
                description="Cantidad de órdenes activas actualmente en el taller de corte, montaje o ensamble."
                steps={[
                  "Se actualiza automáticamente al mover tarjetas en el tablero Trello.",
                  "Cuando el cuadro pasa a 'Listo para Retiro', se descuenta de aquí."
                ]}
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Hammer size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.inProductionCount} órdenes
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Trabajos de corte, ensamblado y vidrio
          </div>
        </div>

        {/* Ready for pickup */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Listos para Retiro</span>
              <ErpHelpTooltip
                title="Cuadros Terminados"
                description="Cuadros concluidos en taller listos para ser entregados al cliente."
                steps={[
                  "Ve a la sección 'Clientes' para enviarles un mensaje directo por WhatsApp.",
                  "Al retirar el cliente, cobra el saldo en 'Caja' y marca como 'Entregado'."
                ]}
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.readyForPickupCount} cuadros
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Notificar clientes para entrega y cobro
          </div>
        </div>

        {/* Critical Stock */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Stock Crítico</span>
              <ErpHelpTooltip
                title="Stock Crítico de Materiales"
                description="Avisa cuando las varillas de molduras o planchas de vidrio están cerca de acabarse."
                steps={[
                  "Ingresa a 'Inventario & Stock' para ver el detalle de cada artículo.",
                  "Haz clic en 'Ajustar' o 'Registrar' para cargar nuevo material del proveedor."
                ]}
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.lowStockCount} insumos
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Molduras o vidrios bajo nivel mínimo
          </div>
        </div>
      </div>

      {/* Main Grid: Trello Tasks Preview + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <ClipboardList size={18} className="text-amber-400" />
              <span>Órdenes de Trabajo Recientes</span>
            </h2>
            <NavLink
              to="/erp/pedidos"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <span>Ver todas</span>
              <ChevronRight size={14} />
            </NavLink>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono uppercase text-neutral-400">
                    <th className="py-3 px-4">Orden</th>
                    <th className="py-3 px-4">Cliente / Detalle</th>
                    <th className="py-3 px-4">Medidas</th>
                    <th className="py-3 px-4 text-right">Total (Gs)</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-amber-400">
                        {order.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-200 text-xs">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[200px]">{order.title}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-neutral-300">
                        {order.widthM}m x {order.heightM}m
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-xs text-neutral-200">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-neutral-800 text-neutral-300 capitalize">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Trello Kanban cards + Critical Inventory */}
        <div className="space-y-6">
          {/* Urgent Trello */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <Kanban size={16} className="text-amber-400" />
                <span>Urgentes en Trello</span>
              </h3>
              <NavLink to="/erp/trello" className="text-[11px] text-amber-400 hover:underline">
                Ir al tablero
              </NavLink>
            </div>

            <div className="space-y-2.5">
              {urgentTrelloTasks.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">No hay trabajos catalogados como urgentes.</p>
              ) : (
                urgentTrelloTasks.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200 truncate">{card.title}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-rose-500/20 text-rose-400">
                        {card.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{card.customerName}</span>
                      <span className="font-mono">{card.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Warning */}
          {criticalInventory.length > 0 && (
            <div className="p-5 rounded-2xl bg-neutral-900 border border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  <span>Alerta de Reposición</span>
                </h3>
                <NavLink to="/erp/inventario" className="text-[11px] text-neutral-400 hover:text-white">
                  Gestionar
                </NavLink>
              </div>

              <div className="space-y-2">
                {criticalInventory.map((item) => (
                  <div key={item.id} className="p-2.5 bg-neutral-950/80 rounded-xl border border-neutral-800 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-200">{item.code}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{item.name}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-rose-400 font-bold">{item.stockMeters} {item.unit}</div>
                      <div className="text-[9px] text-neutral-500">Mín: {item.minStockMeters}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErpDashboard;
