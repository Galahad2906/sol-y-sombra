import { useState, useMemo } from 'react';
import { useErpData } from '../context/ErpDataContext';
import { formatCurrency } from '../../services/pricingService';
import ErpHelpTooltip from '../components/ErpHelpTooltip';
import {
  Package,
  Search,
  AlertTriangle,
  Layers,
  Sparkles,
  Wrench,
  Edit2,
  X,
  Plus,
  CheckCircle2,
  Trash2,
  Sliders
} from 'lucide-react';

const ErpInventory = () => {
  const { inventory, updateInventoryStock, updateInventoryItem, addInventoryItem, deleteInventoryItem } = useErpData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Adjustment modal
  const [editingItem, setEditingItem] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');

  // Full item edit modal
  const [fullEditingItem, setFullEditingItem] = useState(null);

  // Create item modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    category: 'moldura',
    code: '',
    name: '',
    stockMeters: '',
    minStockMeters: '15',
    costPerMeter: '',
    salePricePerMeter: '',
    unit: 'm lineales'
  });

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'todos' || item.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [inventory, searchQuery, categoryFilter]);

  const handleStockUpdate = (e) => {
    e.preventDefault();
    if (!editingItem || newStockValue === '') return;

    updateInventoryStock(editingItem.id, newStockValue);
    setEditingItem(null);
    setNewStockValue('');
  };

  const handleUpdateFullItem = (e) => {
    e.preventDefault();
    if (!fullEditingItem) return;

    updateInventoryItem(fullEditingItem.id, {
      code: fullEditingItem.code,
      name: fullEditingItem.name,
      category: fullEditingItem.category,
      stockMeters: parseFloat(fullEditingItem.stockMeters) || 0,
      minStockMeters: parseFloat(fullEditingItem.minStockMeters) || 10,
      costPerMeter: parseFloat(fullEditingItem.costPerMeter) || 0,
      salePricePerMeter: parseFloat(fullEditingItem.salePricePerMeter) || 0
    });

    setFullEditingItem(null);
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name.trim()) return;

    addInventoryItem({
      ...newItemForm,
      unit: newItemForm.category === 'vidrio' ? 'm²' : (newItemForm.category === 'moldura' ? 'm lineales' : 'unidades'),
      isExample: false
    });

    setIsCreateModalOpen(false);
    setNewItemForm({
      category: 'moldura',
      code: '',
      name: '',
      stockMeters: '',
      minStockMeters: '15',
      costPerMeter: '',
      salePricePerMeter: '',
      unit: 'm lineales'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Inventario & Stock de Taller
            </h1>
            <ErpHelpTooltip
              title="Control de Inventario & Materiales"
              description="Aquí controlas el stock de varillas de moldura (en metros lineales), planchas de cristal (en m²) e insumos de ensamble."
              steps={[
                "Haz clic en 'Registrar Nuevo Material' para dar de alta una moldura o vidrio con su precio de venta.",
                "Haz clic en 'Ajustar' para ingresar compras a proveedores o actualizar metros existentes.",
                "Haz clic en el lápiz para modificar precios o en la papelera para borrar un material."
              ]}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">
            Varillas de moldura (m lineales), planchas de cristal (m²), paspartú e insumos de ensamble.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 shrink-0"
        >
          <Plus size={18} />
          Registrar Nuevo Material
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código de moldura, vidrio o insumo..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
          {[
            { id: 'todos', label: 'Todos los Artículos' },
            { id: 'moldura', label: 'Molduras' },
            { id: 'vidrio', label: 'Vidrios & Cristales' },
            { id: 'insumo', label: 'Insumos / Herrajes' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Descripción del Material</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Stock Actual</th>
                <th className="py-3 px-4 text-right">Stock Mínimo</th>
                <th className="py-3 px-4 text-right">Precio Venta (Gs)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredItems.map((item) => {
                const isLowStock = item.stockMeters <= item.minStockMeters;

                return (
                  <tr key={item.id} className={`hover:bg-neutral-800/40 transition-colors ${item.isExample ? 'opacity-85' : ''}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span>{item.code}</span>
                        {item.isExample && (
                          <span className="px-1 py-0.2 rounded bg-neutral-800 text-neutral-500 font-mono text-[9px] border border-neutral-700">
                            Ejemplo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-200">
                      {item.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 uppercase font-mono">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-100">
                      {item.stockMeters} <span className="text-[11px] text-neutral-500 font-normal">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400 text-xs">
                      {item.minStockMeters} {item.unit}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-neutral-300 font-semibold text-xs">
                      {formatCurrency(item.salePricePerMeter)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <AlertTriangle size={12} />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewStockValue(String(item.stockMeters));
                          }}
                          title="Ajustar cantidad en stock"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors inline-flex items-center gap-1 text-xs"
                        >
                          <Sliders size={13} />
                          <span>Stock</span>
                        </button>
                        <button
                          onClick={() => setFullEditingItem(item)}
                          title="Modificar precio o nombre"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el material ${item.code} - ${item.name}?`)) {
                              deleteInventoryItem(item.id);
                            }
                          }}
                          title="Eliminar material"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Ajuste de Stock: {editingItem.code}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-4 mt-4">
              <p className="text-xs text-neutral-400">{editingItem.name}</p>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Cantidad en Existencia ({editingItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-base font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
                >
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MATERIAL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Registrar Nuevo Material o Moldura
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Categoría</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="moldura">Moldura (m lineales)</option>
                    <option value="vidrio">Vidrio / Cristal (m²)</option>
                    <option value="insumo">Insumo / Herraje</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Código Identificador *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. MOD-05"
                    value={newItemForm.code}
                    onChange={(e) => setNewItemForm({ ...newItemForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Nombre / Descripción Comercial *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Moldura Madera Nogal Envejecido 4cm"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="ej. 30"
                    value={newItemForm.stockMeters}
                    onChange={(e) => setNewItemForm({ ...newItemForm, stockMeters: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="ej. 15"
                    value={newItemForm.minStockMeters}
                    onChange={(e) => setNewItemForm({ ...newItemForm, minStockMeters: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Costo Unitario (Gs)</label>
                  <input
                    type="number"
                    placeholder="ej. 45000"
                    value={newItemForm.costPerMeter}
                    onChange={(e) => setNewItemForm({ ...newItemForm, costPerMeter: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Precio Venta (Gs) *</label>
                  <input
                    type="number"
                    required
                    placeholder="ej. 90000"
                    value={newItemForm.salePricePerMeter}
                    onChange={(e) => setNewItemForm({ ...newItemForm, salePricePerMeter: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
                >
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL EDIT MATERIAL MODAL */}
      {fullEditingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white font-serif">
                Modificar Material: {fullEditingItem.code}
              </h3>
              <button
                onClick={() => setFullEditingItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateFullItem} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Categoría</label>
                  <select
                    value={fullEditingItem.category}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="moldura">Moldura (m lineales)</option>
                    <option value="vidrio">Vidrio / Cristal (m²)</option>
                    <option value="insumo">Insumo / Herraje</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Código Identificador *</label>
                  <input
                    type="text"
                    required
                    value={fullEditingItem.code}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Nombre / Descripción Comercial *</label>
                <input
                  type="text"
                  required
                  value={fullEditingItem.name}
                  onChange={(e) => setFullEditingItem({ ...fullEditingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Stock Actual ({fullEditingItem.unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fullEditingItem.stockMeters}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, stockMeters: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fullEditingItem.minStockMeters}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, minStockMeters: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Costo Unitario (Gs)</label>
                  <input
                    type="number"
                    value={fullEditingItem.costPerMeter || ''}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, costPerMeter: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Precio Venta (Gs) *</label>
                  <input
                    type="number"
                    required
                    value={fullEditingItem.salePricePerMeter}
                    onChange={(e) => setFullEditingItem({ ...fullEditingItem, salePricePerMeter: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFullEditingItem(null)}
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

export default ErpInventory;
