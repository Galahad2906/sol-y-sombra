import { useState, useMemo } from 'react';
import { useErpData } from '../context/ErpDataContext';
import { formatCurrency } from '../../services/pricingService';
import ErpHelpTooltip from '../components/ErpHelpTooltip';
import {
  CircleDollarSign,
  Search,
  Plus,
  Calendar,
  CreditCard,
  Banknote,
  Building2,
  Edit2,
  Trash2,
  X,
  Check
} from 'lucide-react';

const ErpFinances = () => {
  const { transactions, orders, addTransaction, updateTransaction, deleteTransaction } = useErpData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // New transaction state
  const [formData, setFormData] = useState({
    type: 'ingreso',
    category: 'cobro_saldo',
    concept: '',
    amount: '',
    paymentMethod: 'Efectivo en Caja',
    orderId: ''
  });

  const summary = useMemo(() => {
    let totalIncome = 0;
    let cashTotal = 0;
    let transferTotal = 0;
    let cardTotal = 0;

    transactions.forEach(t => {
      if (t.type === 'ingreso') {
        totalIncome += t.amount || 0;
        const method = (t.paymentMethod || '').toLowerCase();
        if (method.includes('efectivo')) {
          cashTotal += t.amount || 0;
        } else if (method.includes('transferencia') || method.includes('itaú') || method.includes('continental')) {
          transferTotal += t.amount || 0;
        } else if (method.includes('tarjeta') || method.includes('pos')) {
          cardTotal += t.amount || 0;
        } else {
          cashTotal += t.amount || 0;
        }
      }
    });

    return { totalIncome, cashTotal, transferTotal, cardTotal };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      (t.concept || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.orderId && t.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.paymentMethod || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!formData.concept || !formData.amount) return;

    addTransaction({
      type: formData.type,
      category: formData.category,
      concept: formData.concept,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      orderId: formData.orderId || null
    });

    setIsModalOpen(false);
    setFormData({
      type: 'ingreso',
      category: 'cobro_saldo',
      concept: '',
      amount: '',
      paymentMethod: 'Efectivo en Caja',
      orderId: ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTx) return;

    updateTransaction(editingTx.id, {
      concept: editingTx.concept,
      amount: parseFloat(editingTx.amount) || 0,
      paymentMethod: editingTx.paymentMethod,
      orderId: editingTx.orderId || null
    });

    setEditingTx(null);
  };

  const handleDelete = (tx) => {
    if (window.confirm(`¿Seguro que deseas eliminar el registro "${tx.concept}" de Gs. ${Number(tx.amount).toLocaleString('es-PY')}?`)) {
      deleteTransaction(tx.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Caja & Control Financiero
            </h1>
            <ErpHelpTooltip
              title="Caja y Movimientos Financieros"
              content="Control exhaustivo de ingresos de caja, señas de clientes, cancelaciones al entregar cuadros y transferencias bancarias en Guaraníes (Gs)."
              steps={[
                'Las señas de nuevos pedidos se acreditan automáticamente en este libro contable.',
                'Para registrar cobros de saldo o ventas directas de accesorios, haz clic en "+ Registrar Cobro Manual".',
                'Usa los botones de Editar o Borrar para corregir montos o anular asientos erróneos.',
                'Filtra en el buscador por número de orden o banco para realizar arqueos diarios de caja.'
              ]}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">
            Libro de señas, cancelaciones de saldo y cobros por enmarcados en Guaraníes (Gs).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 shrink-0"
        >
          <Plus size={18} />
          Registrar Cobro Manual
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Ingresos Totales</span>
              <ErpHelpTooltip
                title="Ingresos Totales Acumulados"
                content="Suma consolidada de todas las señas y cancelaciones cobradas a la fecha."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CircleDollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(summary.totalIncome)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Señas y cancelaciones acumuladas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Efectivo en Caja</span>
              <ErpHelpTooltip
                title="Efectivo en Caja Chica"
                content="Monto físico en billetes disponible en el taller para vueltos y compras menores."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Banknote size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatCurrency(summary.cashTotal)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Dinero físico en taller
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Transferencias Bancarias</span>
              <ErpHelpTooltip
                title="Bancos y SIPAP"
                content="Fondos recibidos por transferencia bancaria (Itaú, Continental, BNF, etc.)."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {formatCurrency(summary.transferTotal)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Itaú, Continental, BNF
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider">Tarjetas POS</span>
              <ErpHelpTooltip
                title="Cobros con Tarjetas"
                content="Pagos procesados mediante terminales de débito y crédito Bancard."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {formatCurrency(summary.cardTotal)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Débito y crédito
          </div>
        </div>
      </div>

      {/* Transactions Search */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por concepto, número de orden o forma de pago..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>Total movimientos: <strong className="text-white font-mono">{filteredTransactions.length}</strong></span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Concepto / Detalle</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Orden Vinculada</th>
                <th className="py-3 px-4 text-right">Monto (Gs)</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No se encontraron movimientos registrados
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isEx = Boolean(tx.isExample);
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-neutral-800/40 transition-colors ${
                        isEx ? 'opacity-80 bg-neutral-950/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-neutral-500" />
                          <span>{tx.date}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-xs ${isEx ? 'text-neutral-400' : 'text-neutral-200'}`}>
                            {tx.concept}
                          </span>
                          {isEx && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-amber-400/80 border border-neutral-700/50">
                              Ejemplo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 capitalize">
                          {tx.category ? tx.category.replace('_', ' ') : 'movimiento'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-300">
                        {tx.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-amber-400">
                        {tx.orderId || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        +{formatCurrency(tx.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => setEditingTx({ ...tx })}
                            title="Modificar movimiento"
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-700 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx)}
                            title="Eliminar movimiento"
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-700 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Registrar Movimiento de Caja
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Concepto *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Cobro de saldo entrega cuadro"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Monto en Guaraníes (Gs) *</label>
                <input
                  type="number"
                  required
                  placeholder="ej. 300000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Método de Cobro</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Efectivo en Caja">Efectivo en Caja</option>
                  <option value="Transferencia Bancaria (Itaú)">Transferencia Bancaria (Itaú)</option>
                  <option value="Transferencia Bancaria (Continental)">Transferencia Bancaria (Continental)</option>
                  <option value="Tarjeta de Crédito / Débito (POS)">Tarjeta de Crédito / Débito (POS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Número de Orden (Opcional)</label>
                <select
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Ninguna / Ingreso independiente</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>
                  ))}
                </select>
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
                  Registrar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TRANSACTION MODAL */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Modificar Movimiento de Caja
              </h3>
              <button
                onClick={() => setEditingTx(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Concepto *</label>
                <input
                  type="text"
                  required
                  value={editingTx.concept}
                  onChange={(e) => setEditingTx({ ...editingTx, concept: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Monto en Guaraníes (Gs) *</label>
                <input
                  type="number"
                  required
                  value={editingTx.amount}
                  onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Método de Cobro</label>
                <select
                  value={editingTx.paymentMethod}
                  onChange={(e) => setEditingTx({ ...editingTx, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Efectivo en Caja">Efectivo en Caja</option>
                  <option value="Transferencia Bancaria (Itaú)">Transferencia Bancaria (Itaú)</option>
                  <option value="Transferencia Bancaria (Continental)">Transferencia Bancaria (Continental)</option>
                  <option value="Tarjeta de Crédito / Débito (POS)">Tarjeta de Crédito / Débito (POS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Orden Vinculada</label>
                <select
                  value={editingTx.orderId || ''}
                  onChange={(e) => setEditingTx({ ...editingTx, orderId: e.target.value || null })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Ninguna</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
                >
                  <Check size={14} />
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

export default ErpFinances;
