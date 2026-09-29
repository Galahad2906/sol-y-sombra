import { useState, useMemo } from 'react';
import { useErpData } from '../context/ErpDataContext';
import { formatCurrency } from '../../services/pricingService';
import ErpHelpTooltip from '../components/ErpHelpTooltip';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageCircle,
  X,
  CreditCard,
  Building,
  UserCheck,
  Edit2,
  Trash2
} from 'lucide-react';

const ErpCustomers = () => {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useErpData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '+595',
    email: '',
    document: '',
    city: 'Asunción',
    notes: ''
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.document?.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addCustomer(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      company: '',
      phone: '+595',
      email: '',
      document: '',
      city: 'Asunción',
      notes: ''
    });
  };

  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name.trim()) return;

    updateCustomer(editingCustomer.id, {
      name: editingCustomer.name,
      company: editingCustomer.company,
      phone: editingCustomer.phone,
      email: editingCustomer.email,
      document: editingCustomer.document,
      city: editingCustomer.city,
      notes: editingCustomer.notes
    });

    setEditingCustomer(null);
  };

  const getWhatsAppLink = (phone, customerName, template = 'listo') => {
    const cleanPhone = phone?.replace(/[^0-9]/g, '') || '';
    let message = '';

    if (template === 'listo') {
      message = `Hola ${customerName}, le saludamos de Sol & Sombra SRL. Le informamos que su trabajo de enmarcado ya se encuentra terminado y listo para retirar en nuestro taller. ¡Muchas gracias!`;
    } else {
      message = `Hola ${customerName}, le saludamos cordialmente de Sol & Sombra SRL.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Directorio de Clientes (CRM)
            </h1>
            <ErpHelpTooltip
              title="Gestión de Clientes (CRM)"
              description="Aquí administras tu base de datos de clientes, arquitectos y galerías, con acceso a su historial de enmarcados, saldos y contacto directo por WhatsApp."
              steps={[
                "Haz clic en 'Registrar Nuevo Cliente' para dar de alta un nuevo contacto.",
                "Haz clic en 'Avisar Retiro (WA)' para abrir WhatsApp con un mensaje pre-redactado de retiro.",
                "Usa el botón de lápiz para modificar datos o la papelera para eliminarlo."
              ]}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">
            Base de clientes, arquitectos, galerías de arte, historial de órdenes y contacto directo.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 shrink-0"
        >
          <Plus size={18} />
          Registrar Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, empresa, teléfono o RUC/C.I..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => {
          const customerOrders = orders.filter(o => o.customerId === customer.id);
          const hasBalance = (customer.pendingBalance || 0) > 0;

          return (
            <div
              key={customer.id}
              className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all group ${
                customer.isExample
                  ? 'bg-neutral-900/60 border border-neutral-800/60 opacity-90'
                  : 'bg-neutral-900 border border-neutral-800 hover:border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-neutral-100 group-hover:text-amber-400 transition-colors">
                        {customer.name}
                      </h3>
                      {customer.isExample && (
                        <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-500 font-mono text-[9px] border border-neutral-700">
                          Ejemplo
                        </span>
                      )}
                    </div>
                    {customer.company && (
                      <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <Building size={12} className="text-amber-500/80" />
                        <span>{customer.company}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {customer.document || 'S/D'}
                    </span>
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      title="Modificar datos del cliente"
                      className="p-1 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al cliente ${customer.name}?`)) {
                          deleteCustomer(customer.id);
                        }
                      }}
                      title="Eliminar cliente"
                      className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-neutral-500" />
                    <span className="font-mono">{customer.phone}</span>
                  </div>

                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-neutral-500" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}

                  {customer.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-neutral-500" />
                      <span>{customer.city}</span>
                    </div>
                  )}

                  {customer.notes && (
                    <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 italic">
                      "{customer.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">
                    {customerOrders.length || customer.totalOrders || 0} órdenes históricas
                  </span>
                  {hasBalance ? (
                    <span className="text-rose-400 font-mono font-bold">
                      Saldo: {formatCurrency(customer.pendingBalance)}
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-[11px] font-medium">Al día</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(customer.phone, customer.name, 'listo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>Avisar Retiro (WA)</span>
                  </a>

                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs border border-neutral-700 transition-colors"
                  >
                    Historial
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* NEW CUSTOMER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white font-serif">
                Nuevo Registro de Cliente
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Arq. Claudia Benítez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Empresa / Estudio</label>
                  <input
                    type="text"
                    placeholder="ej. Benítez Diseños"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">RUC o Cédula</label>
                  <input
                    type="text"
                    placeholder="ej. 3.450.120-4"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="text"
                    required
                    placeholder="+595981123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Asunción"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="cliente@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Notas de Preferencias</label>
                <textarea
                  rows={2}
                  placeholder="ej. Prefiere paspartú ancho, atención por WhatsApp..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400 font-mono">Historial de órdenes de enmarcado</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {orders.filter(o => o.customerId === selectedCustomer.id).length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 italic">
                  Este cliente no tiene órdenes registradas aún en el sistema.
                </div>
              ) : (
                orders
                  .filter(o => o.customerId === selectedCustomer.id)
                  .map((order) => (
                    <div key={order.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-mono font-bold text-amber-400">{order.id}</div>
                        <div className="text-neutral-200 font-medium mt-0.5">{order.title}</div>
                        <div className="text-[11px] text-neutral-500">{order.moldingName} | {order.widthM}x{order.heightM}m</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-white font-bold">{formatCurrency(order.totalPrice)}</div>
                        <div className="text-[10px] text-neutral-400 uppercase">{order.status}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white font-serif">
                Modificar Datos del Cliente
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Empresa / Estudio</label>
                  <input
                    type="text"
                    value={editingCustomer.company || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">RUC o Cédula</label>
                  <input
                    type="text"
                    value={editingCustomer.document || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, document: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={editingCustomer.city || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Notas de Preferencias</label>
                <textarea
                  rows={2}
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
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

export default ErpCustomers;
