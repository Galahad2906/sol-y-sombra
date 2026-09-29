import { useState, useMemo } from 'react';
import { useErpData } from '../context/ErpDataContext';
import {
  Plus,
  Search,
  Calendar,
  CheckSquare,
  User,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  SlidersHorizontal,
  X,
  Tag,
  CheckCircle2
} from 'lucide-react';

const ErpTrello = () => {
  const {
    trelloColumns,
    trelloCards,
    moveTrelloCard,
    addTrelloCard,
    updateTrelloCard,
    deleteTrelloCard,
    toggleCardChecklistItem,
    addChecklistItemToCard
  } = useErpData();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  const [assigneeFilter, setAssigneeFilter] = useState('todos');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newChecklistText, setNewChecklistText] = useState('');

  // New card form state
  const [newCardForm, setNewCardForm] = useState({
    columnId: 'col-nuevos',
    title: '',
    customerName: '',
    priority: 'normal',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    assignedTo: 'Carlos Maidana',
    tags: '',
    description: '',
    checklists: ''
  });

  // Filtered cards
  const filteredCards = useMemo(() => {
    return trelloCards.filter(card => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.orderId && card.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'todos' || card.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === 'todos' || card.assignedTo === assigneeFilter;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [trelloCards, searchQuery, priorityFilter, assigneeFilter]);

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgente':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Urgente
          </span>
        );
      case 'alta':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Alta
          </span>
        );
      case 'baja':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Baja
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-700/60 text-neutral-300">
            Normal
          </span>
        );
    }
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newCardForm.title.trim()) return;

    const parsedTags = newCardForm.tags
      ? newCardForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : ['Taller'];

    const parsedChecklists = newCardForm.checklists
      ? newCardForm.checklists.split('\n').filter(Boolean).map((line, idx) => ({
          id: `chk-${Date.now()}-${idx}`,
          text: line.trim(),
          done: false
        }))
      : [];

    addTrelloCard({
      columnId: newCardForm.columnId,
      title: newCardForm.title,
      customerName: newCardForm.customerName || 'Cliente Particular',
      priority: newCardForm.priority,
      dueDate: newCardForm.dueDate,
      assignedTo: newCardForm.assignedTo,
      tags: parsedTags,
      description: newCardForm.description,
      checklists: parsedChecklists
    });

    setIsCreateModalOpen(false);
    setNewCardForm({
      columnId: 'col-nuevos',
      title: '',
      customerName: '',
      priority: 'normal',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      assignedTo: 'Carlos Maidana',
      tags: '',
      description: '',
      checklists: ''
    });
  };

  // Move card to previous or next column
  const handleShiftColumn = (card, direction) => {
    const currentIndex = trelloColumns.findIndex(c => c.id === card.columnId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < trelloColumns.length) {
      moveTrelloCard(card.id, trelloColumns[targetIndex].id);
      if (selectedCard?.id === card.id) {
        setSelectedCard({ ...card, columnId: trelloColumns[targetIndex].id });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Tablero Trello de Producción
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Privado
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">
            Flujo de trabajo de enmarcados, armado de molduras, corte de vidrio y entregas.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 shrink-0"
        >
          <Plus size={18} />
          Nueva Tarjeta de Trabajo
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, título o pedido (ej. SYS-2026-001)..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <SlidersHorizontal size={14} />
            <span>Prioridad:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="todos">Todas</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <User size={14} />
            <span>Responsable:</span>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="Carlos Maidana">Carlos Maidana (Taller)</option>
              <option value="Mariana Benítez">Mariana Benítez (Ventas)</option>
              <option value="Guillermo Zarza">Guillermo Zarza (Dirección)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin">
        {trelloColumns.map((col) => {
          const colCards = filteredCards.filter(c => c.columnId === col.id);

          return (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const cardId = e.dataTransfer.getData('text/plain');
                if (cardId) moveTrelloCard(cardId, col.id);
              }}
              className="w-80 shrink-0 bg-neutral-900/80 rounded-2xl border border-neutral-800 flex flex-col max-h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 ${col.color}`} />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-200">
                    {col.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono font-bold text-xs rounded-full">
                  {colCards.length}
                </span>
              </div>

              {/* Column Cards List */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                {colCards.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-neutral-800/80 rounded-xl text-neutral-600 text-xs italic">
                    Sin trabajos en esta etapa
                  </div>
                ) : (
                  colCards.map((card) => {
                    const completedChecklists = (card.checklists || []).filter(c => c.done).length;
                    const totalChecklists = (card.checklists || []).length;

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', card.id);
                        }}
                        onClick={() => setSelectedCard(card)}
                        className="p-3.5 bg-neutral-950/90 rounded-xl border border-neutral-800 hover:border-amber-500/50 transition-all shadow-md cursor-grab active:cursor-grabbing hover:-translate-y-0.5 group relative"
                      >
                        {/* Header tags & priority */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {getPriorityBadge(card.priority)}
                          {card.orderId && (
                            <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {card.orderId}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-medium text-sm text-neutral-100 line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                          {card.title}
                        </h4>

                        {/* Customer */}
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                          <span>{card.customerName}</span>
                        </div>

                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {card.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 bg-neutral-900 text-neutral-400 rounded text-[10px] font-mono border border-neutral-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Checklist progress */}
                        {totalChecklists > 0 && (
                          <div className="mt-3 pt-2 border-t border-neutral-900">
                            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                              <span className="flex items-center gap-1">
                                <CheckSquare size={12} className="text-amber-500" />
                                <span>Tareas de Taller</span>
                              </span>
                              <span className="font-mono">
                                {completedChecklists}/{totalChecklists}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 transition-all"
                                style={{
                                  width: `${(completedChecklists / totalChecklists) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Due date & Assignee & Quick Mover */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar size={13} className="text-neutral-500" />
                            <span className="font-mono text-neutral-400">{card.dueDate}</span>
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              title="Mover a etapa anterior"
                              onClick={() => handleShiftColumn(card, 'prev')}
                              disabled={col.id === trelloColumns[0].id}
                              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowLeft size={14} />
                            </button>
                            <button
                              title="Avanzar a siguiente etapa"
                              onClick={() => handleShiftColumn(card, 'next')}
                              disabled={col.id === trelloColumns[trelloColumns.length - 1].id}
                              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Column Footer: Quick add button */}
              <div className="p-2 border-t border-neutral-800/80">
                <button
                  onClick={() => {
                    setNewCardForm(prev => ({ ...prev, columnId: col.id }));
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/70 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  Añadir tarjeta a esta etapa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE CARD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white font-serif">
                Nueva Tarjeta de Producción
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Título del Trabajo / Cuadro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Cuadro Óleo Abstracto 100x70cm"
                  value={newCardForm.title}
                  onChange={(e) => setNewCardForm({ ...newCardForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    value={newCardForm.customerName}
                    onChange={(e) => setNewCardForm({ ...newCardForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Etapa Inicial
                  </label>
                  <select
                    value={newCardForm.columnId}
                    onChange={(e) => setNewCardForm({ ...newCardForm, columnId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {trelloColumns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newCardForm.priority}
                    onChange={(e) => setNewCardForm({ ...newCardForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Fecha Entrega
                  </label>
                  <input
                    type="date"
                    value={newCardForm.dueDate}
                    onChange={(e) => setNewCardForm({ ...newCardForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Asignado
                  </label>
                  <select
                    value={newCardForm.assignedTo}
                    onChange={(e) => setNewCardForm({ ...newCardForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Carlos Maidana">Carlos Maidana (Taller)</option>
                    <option value="Mariana Benítez">Mariana Benítez (Ventas)</option>
                    <option value="Guillermo Zarza">Guillermo Zarza (Dirección)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  placeholder="ej. Moldura 02, Vidrio Mate, Urgente"
                  value={newCardForm.tags}
                  onChange={(e) => setNewCardForm({ ...newCardForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Checklist de Subtareas de Taller (una por línea)
                </label>
                <textarea
                  rows={3}
                  placeholder="Corte de moldura a 45 grados&#10;Corte de vidrio mate&#10;Colocar paspartú y sellado posterior"
                  value={newCardForm.checklists}
                  onChange={(e) => setNewCardForm({ ...newCardForm, checklists: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
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
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD DETAILS & CHECKLIST MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getPriorityBadge(selectedCard.priority)}
                  {selectedCard.orderId && (
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Orden: {selectedCard.orderId}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white font-serif">
                  {selectedCard.title}
                </h2>
                <div className="text-sm text-neutral-400 mt-1">
                  Cliente: <span className="text-neutral-200 font-medium">{selectedCard.customerName}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stage mover bar */}
            <div className="my-5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">Etapa en Taller:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {trelloColumns.map(col => (
                  <button
                    key={col.id}
                    onClick={() => {
                      moveTrelloCard(selectedCard.id, col.id);
                      setSelectedCard({ ...selectedCard, columnId: col.id });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedCard.columnId === col.id
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    {col.title.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Information Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 space-y-1">
                <span className="text-neutral-500 uppercase font-mono text-[10px]">Responsable Asignado</span>
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <User size={14} className="text-amber-400" />
                  <span>{selectedCard.assignedTo}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 space-y-1">
                <span className="text-neutral-500 uppercase font-mono text-[10px]">Fecha Prometida de Entrega</span>
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Calendar size={14} className="text-amber-400" />
                  <span className="font-mono">{selectedCard.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedCard.description && (
              <div className="mt-5">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Especificaciones y Notas de Taller
                </h4>
                <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-neutral-300 leading-relaxed font-mono text-xs">
                  {selectedCard.description}
                </div>
              </div>
            )}

            {/* Interactive Checklists */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare size={14} className="text-amber-400" />
                  <span>Subtareas de Fabricación ({selectedCard.checklists?.length || 0})</span>
                </h4>
              </div>

              <div className="space-y-2">
                {(!selectedCard.checklists || selectedCard.checklists.length === 0) ? (
                  <p className="text-xs text-neutral-500 italic">No hay tareas específicas asignadas a esta tarjeta.</p>
                ) : (
                  selectedCard.checklists.map((chk) => (
                    <label
                      key={chk.id}
                      className="flex items-center gap-3 p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={chk.done}
                        onChange={() => {
                          toggleCardChecklistItem(selectedCard.id, chk.id);
                          const updated = (selectedCard.checklists || []).map(c =>
                            c.id === chk.id ? { ...c, done: !c.done } : c
                          );
                          setSelectedCard({ ...selectedCard, checklists: updated });
                        }}
                        className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900"
                      />
                      <span
                        className={`text-sm select-none ${
                          chk.done ? 'line-through text-neutral-500' : 'text-neutral-200'
                        }`}
                      >
                        {chk.text}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {/* Inline Add Checklist Item */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+ Añadir nueva subtarea (ej. Limpieza de cristal)..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newChecklistText.trim()) {
                      e.preventDefault();
                      const added = addChecklistItemToCard(selectedCard.id, newChecklistText);
                      if (added) {
                        setSelectedCard(prev => ({
                          ...prev,
                          checklists: [...(prev.checklists || []), added]
                        }));
                        setNewChecklistText('');
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newChecklistText.trim()) {
                      const added = addChecklistItemToCard(selectedCard.id, newChecklistText);
                      if (added) {
                        setSelectedCard(prev => ({
                          ...prev,
                          checklists: [...(prev.checklists || []), added]
                        }));
                        setNewChecklistText('');
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-lg transition-colors shrink-0"
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-8 pt-5 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta tarjeta del tablero?')) {
                    deleteTrelloCard(selectedCard.id);
                    setSelectedCard(null);
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
                <span>Eliminar Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpTrello;
