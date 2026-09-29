import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useErpAuth } from '../context/ErpAuthContext';
import { useErpData } from '../context/ErpDataContext';
import {
  LayoutDashboard,
  Kanban,
  ClipboardList,
  Users,
  Package,
  CircleDollarSign,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  Hammer,
  ShoppingBag,
  RotateCcw,
  HelpCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';

const ErpLayout = ({ children }) => {
  const { user, logout } = useErpAuth();
  const { trelloCards, inventory, resetToDefaults } = useErpData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/erp/login');
  };

  // Count active Trello cards in production
  const activeTrelloCount = trelloCards.filter(
    c => c.columnId !== 'col-entregado'
  ).length;

  // Count low stock items
  const lowStockCount = inventory.filter(
    i => i.stockMeters <= i.minStockMeters
  ).length;

  const navItems = [
    {
      to: '/erp/dashboard',
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/erp/trello',
      label: 'Tablero Trello (Taller)',
      icon: Kanban,
      badge: activeTrelloCount > 0 ? activeTrelloCount : null,
      badgeColor: 'bg-amber-500 text-black'
    },
    {
      to: '/erp/pedidos',
      label: 'Pedidos & Cotizador',
      icon: ClipboardList,
      badge: null
    },
    {
      to: '/erp/clientes',
      label: 'Clientes (CRM)',
      icon: Users,
      badge: null
    },
    {
      to: '/erp/inventario',
      label: 'Inventario & Stock',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      to: '/erp/caja',
      label: 'Caja & Finanzas',
      icon: CircleDollarSign,
      badge: null
    }
  ];

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldCheck size={13} />
            Administración
          </span>
        );
      case 'taller':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Hammer size={13} />
            Taller & Producción
          </span>
        );
      case 'ventas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShoppingBag size={13} />
            Ventas & Atención
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans antialiased">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif font-black text-neutral-950 text-xl shadow-lg shadow-amber-500/20">
              S
            </div>
            <div>
              <div className="font-bold tracking-wider text-sm text-neutral-100 uppercase font-serif">
                Sol & Sombra <span className="text-amber-400 text-xs font-sans">SRL</span>
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono uppercase tracking-widest">
                ERP Empresarial Privado
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/40"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="mt-1">{getRoleBadge()}</div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="px-4 mb-2">
          <button
            onClick={() => {
              navigate('/erp/pedidos?action=new');
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/10 transition-all active:scale-98"
          >
            <PlusCircle size={16} />
            NUEVA COTIZACIÓN / ORDEN
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-semibold border-l-4 border-amber-500 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.badgeColor || 'bg-neutral-700 text-neutral-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Taller Conectado
            </span>
            <button
              onClick={() => {
                if (confirm('¿Restablecer los datos a los valores iniciales de demostración?')) {
                  resetToDefaults();
                }
              }}
              title="Restablecer datos iniciales de demo"
              className="text-[10px] text-neutral-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={10} />
              <span>Reset Demo</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-neutral-800"
          >
            <LogOut size={15} />
            Cerrar Sesión Segura
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-mono uppercase text-amber-500 tracking-wider">
                Área Administrativa & Operativa
              </span>
              <h1 className="text-sm font-semibold text-neutral-200">
                Sol & Sombra S.R.L. — Asunción, Paraguay
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Guide Button */}
            <button
              onClick={() => setGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-amber-500/10 text-xs font-medium text-amber-400 border border-neutral-700/80 hover:border-amber-500/40 transition-all"
            >
              <HelpCircle size={15} />
              <span className="hidden md:inline">Guía del Sistema</span>
            </button>

            <NavLink
              to="/erp/trello"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 border border-neutral-700 transition-colors"
            >
              <Kanban size={14} className="text-amber-400" />
              <span>Trello Taller</span>
              {activeTrelloCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-neutral-950 font-bold text-[10px] rounded-full">
                  {activeTrelloCount}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-[1px] bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-neutral-200 leading-tight">
                  {user?.name}
                </div>
                <div className="text-[10px] text-neutral-400 leading-tight">
                  {user?.title}
                </div>
              </div>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/30"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-neutral-950">
          {children}
        </main>
      </div>

      {/* SYSTEM GUIDE MODAL */}
      {guideModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Manual Operativo Rápido — Sol & Sombra SRL
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Flujo de trabajo paso a paso para el taller de enmarcado
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                  <ClipboardList size={16} />
                  <span>1. Pedidos & Cotizador de Enmarcados</span>
                </div>
                <p className="text-neutral-400">
                  Ingresa las dimensiones exactas (ancho y alto en metros). El sistema calcula el perímetro lineal de moldura, los $m^2$ de vidrio, el IVA (10%) y la seña mínima del 50%. Al confirmar, puedes descargar e imprimir la <strong>Orden de Taller en PDF</strong> y avisar al cliente por WhatsApp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                  <Kanban size={16} />
                  <span>2. Tablero Trello Privado para Carpintería</span>
                </div>
                <p className="text-neutral-400">
                  Cada pedido genera automáticamente una tarjeta con checklist de 4 pasos (Corte de moldura, Corte de vidrio, Montaje, y Colgador). Los artesanos pueden arrastrar la tarjeta o avanzar fase por fase hasta la entrega final.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                  <Package size={16} />
                  <span>3. Stock de Molduras y Vidrios</span>
                </div>
                <p className="text-neutral-400">
                  Controla metros lineales de varillas de madera y $m^2$ de vidrios (sencillo, antirreflejo, museo). Si el stock cae por debajo del umbral mínimo, el sistema alerta en rojo para reponer con aserraderos o vidrierías.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                  <Users size={16} />
                  <span>4. Directorio de Clientes (CRM)</span>
                </div>
                <p className="text-neutral-400">
                  Base de datos de artistas, decoradores y particulares con RUC/CI y teléfono paraguayo. Incluye botón directo de WhatsApp con mensaje predeterminado para notificar retiros de obras terminadas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                  <CircleDollarSign size={16} />
                  <span>5. Caja y Libro Financiero</span>
                </div>
                <p className="text-neutral-400">
                  Registra automáticamente las señas cobradas, cancelaciones al entregar cuadros y arqueo por tipo de pago (efectivo en caja, transferencias SIPAP o tarjetas POS).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 size={15} className="text-amber-400" />
                  <span>Datos de Demostración y Ejemplos</span>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  Todos los registros de muestra están identificados en gris con el rótulo <strong>[Ejemplo]</strong>. Si tu cliente desea comenzar a cargar sus datos reales inmediatamente, puedes presionar el botón <strong>"Vaciar datos de ejemplo para empezar de cero"</strong> en el Panel General o borrar/editar cualquier registro individualmente.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-800">
              <button
                onClick={() => setGuideModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpLayout;
