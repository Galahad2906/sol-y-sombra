import { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_TRELLO_COLUMNS,
  INITIAL_TRELLO_CARDS,
  INITIAL_TRANSACTIONS
} from '../data/mockErpData';

const ErpDataContext = createContext(null);

const STORAGE_KEY = 'sol_y_sombra_erp_data_v1';

export const ErpDataProvider = ({ children }) => {
  // Load state from localStorage or seed
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading ERP data from storage:', e);
    }
    return {
      customers: INITIAL_CUSTOMERS,
      inventory: INITIAL_INVENTORY,
      orders: INITIAL_ORDERS,
      trelloColumns: INITIAL_TRELLO_COLUMNS,
      trelloCards: INITIAL_TRELLO_CARDS,
      transactions: INITIAL_TRANSACTIONS
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving ERP data:', e);
    }
  }, [data]);

  // --- ORDERS ACTIONS ---
  const addOrder = (orderInput, createTrelloCard = true) => {
    const orderId = `SYS-${new Date().getFullYear()}-${String(data.orders.length + 1).padStart(3, '0')}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      promiseDate: orderInput.promiseDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      customerId: orderInput.customerId,
      customerName: orderInput.customerName,
      title: orderInput.title || `Enmarcado ${orderInput.widthM}m x ${orderInput.heightM}m`,
      widthM: parseFloat(orderInput.widthM) || 0.4,
      heightM: parseFloat(orderInput.heightM) || 0.5,
      moldingCode: orderInput.moldingCode || 'MOD-03',
      moldingName: orderInput.moldingName || 'Moldura Estándar',
      moldingPrice: parseFloat(orderInput.moldingPrice) || 75000,
      glassType: orderInput.glassType || 'sencillo',
      glassName: orderInput.glassName || 'Vidrio Sencillo',
      paymentMethod: orderInput.paymentMethod || 'efectivo',
      totalPrice: parseFloat(orderInput.totalPrice) || 0,
      deposit: parseFloat(orderInput.deposit) || 0,
      balance: Math.max(0, (parseFloat(orderInput.totalPrice) || 0) - (parseFloat(orderInput.deposit) || 0)),
      status: 'produccion',
      hasTrelloCard: createTrelloCard,
      trelloCardId: null
    };

    let updatedCards = [...data.trelloCards];

    if (createTrelloCard) {
      const newCardId = `card-${Date.now()}`;
      newOrder.trelloCardId = newCardId;

      const perimeter = ((newOrder.widthM + newOrder.heightM) * 2).toFixed(2);
      const newCard = {
        id: newCardId,
        columnId: 'col-nuevos',
        orderId: newOrder.id,
        title: `${newOrder.title} (${newOrder.widthM}x${newOrder.heightM}m)`,
        customerName: newOrder.customerName,
        priority: 'normal',
        dueDate: newOrder.promiseDate,
        assignedTo: 'Carlos Maidana',
        tags: [newOrder.moldingCode, newOrder.glassName],
        description: `Medidas: ${newOrder.widthM}m x ${newOrder.heightM}m. Moldura: ${newOrder.moldingName}. Saldo pendiente: Gs ${newOrder.balance.toLocaleString('es-PY')}.`,
        checklists: [
          { id: `chk-${Date.now()}-1`, text: `Cortar ${perimeter}m de moldura ${newOrder.moldingCode}`, done: false },
          { id: `chk-${Date.now()}-2`, text: `Corte de vidrio ${newOrder.glassName} (${newOrder.widthM}x${newOrder.heightM})`, done: false },
          { id: `chk-${Date.now()}-3`, text: 'Montaje de obra y sellado posterior con kraft', done: false },
          { id: `chk-${Date.now()}-4`, text: 'Colocar colgador y control de calidad', done: false }
        ]
      };
      updatedCards = [newCard, ...updatedCards];
    }

    // Register deposit transaction if greater than 0
    let updatedTransactions = [...data.transactions];
    if (newOrder.deposit > 0) {
      const newTx = {
        id: `tx-${Date.now()}`,
        date: newOrder.date,
        type: 'ingreso',
        category: newOrder.balance === 0 ? 'pago_total' : 'seña',
        concept: `Cobro Seña / Anticipo Orden ${newOrder.id} (${newOrder.customerName})`,
        amount: newOrder.deposit,
        paymentMethod: newOrder.paymentMethod,
        orderId: newOrder.id
      };
      updatedTransactions = [newTx, ...updatedTransactions];
    }

    // Update customer stats
    const updatedCustomers = data.customers.map(c => {
      if (c.id === newOrder.customerId) {
        return {
          ...c,
          totalOrders: (c.totalOrders || 0) + 1,
          pendingBalance: (c.pendingBalance || 0) + newOrder.balance
        };
      }
      return c;
    });

    setData(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      trelloCards: updatedCards,
      transactions: updatedTransactions,
      customers: updatedCustomers
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    }));
  };

  // --- TRELLO KANBAN ACTIONS ---
  const moveTrelloCard = (cardId, targetColumnId) => {
    setData(prev => {
      const card = prev.trelloCards.find(c => c.id === cardId);
      if (!card) return prev;

      const updatedCard = { ...card, columnId: targetColumnId };
      const otherCards = prev.trelloCards.filter(c => c.id !== cardId);

      // Auto-update order status if linked
      let updatedOrders = prev.orders;
      if (card.orderId) {
        let mappedStatus = null;
        if (targetColumnId === 'col-nuevos' || targetColumnId === 'col-corte' || targetColumnId === 'col-vidrio' || targetColumnId === 'col-montaje') {
          mappedStatus = 'produccion';
        } else if (targetColumnId === 'col-listo') {
          mappedStatus = 'listo';
        } else if (targetColumnId === 'col-entregado') {
          mappedStatus = 'entregado';
        }

        if (mappedStatus) {
          updatedOrders = prev.orders.map(o => o.id === card.orderId ? { ...o, status: mappedStatus } : o);
        }
      }

      return {
        ...prev,
        trelloCards: [...otherCards, updatedCard],
        orders: updatedOrders
      };
    });
  };

  const addTrelloCard = (cardInput) => {
    const newCard = {
      id: `card-${Date.now()}`,
      columnId: cardInput.columnId || 'col-nuevos',
      orderId: cardInput.orderId || null,
      title: cardInput.title || 'Nueva Tarea de Taller',
      customerName: cardInput.customerName || 'Interno / Taller',
      priority: cardInput.priority || 'normal',
      dueDate: cardInput.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      assignedTo: cardInput.assignedTo || 'Carlos Maidana',
      tags: cardInput.tags || ['Taller'],
      description: cardInput.description || '',
      checklists: cardInput.checklists || []
    };

    setData(prev => ({
      ...prev,
      trelloCards: [newCard, ...prev.trelloCards]
    }));

    return newCard;
  };

  const updateTrelloCard = (cardId, updates) => {
    setData(prev => ({
      ...prev,
      trelloCards: prev.trelloCards.map(c => (c.id === cardId ? { ...c, ...updates } : c))
    }));
  };

  const deleteTrelloCard = (cardId) => {
    setData(prev => ({
      ...prev,
      trelloCards: prev.trelloCards.filter(c => c.id !== cardId)
    }));
  };

  const toggleCardChecklistItem = (cardId, checkId) => {
    setData(prev => ({
      ...prev,
      trelloCards: prev.trelloCards.map(c => {
        if (c.id !== cardId) return c;
        const updatedChecklists = (c.checklists || []).map(chk => 
          chk.id === checkId ? { ...chk, done: !chk.done } : chk
        );
        return { ...c, checklists: updatedChecklists };
      })
    }));
  };

  const addChecklistItemToCard = (cardId, text) => {
    if (!text.trim()) return;
    const newItem = {
      id: `chk-${Date.now()}`,
      text: text.trim(),
      done: false
    };

    setData(prev => ({
      ...prev,
      trelloCards: prev.trelloCards.map(c => {
        if (c.id !== cardId) return c;
        return {
          ...c,
          checklists: [...(c.checklists || []), newItem]
        };
      })
    }));

    return newItem;
  };

  const deleteOrder = (orderId) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== orderId),
      trelloCards: prev.trelloCards.filter(c => c.orderId !== orderId)
    }));
  };

  // --- CUSTOMER ACTIONS ---
  const addCustomer = (customerInput) => {
    const newCustomer = {
      id: `cli-${Date.now().toString().slice(-4)}`,
      name: customerInput.name,
      company: customerInput.company || '',
      phone: customerInput.phone || '',
      email: customerInput.email || '',
      document: customerInput.document || '',
      city: customerInput.city || 'Asunción',
      notes: customerInput.notes || '',
      totalOrders: 0,
      pendingBalance: 0
    };

    setData(prev => ({
      ...prev,
      customers: [newCustomer, ...prev.customers]
    }));

    return newCustomer;
  };

  const deleteCustomer = (customerId) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== customerId)
    }));
  };

  // --- INVENTORY ACTIONS ---
  const addInventoryItem = (itemInput) => {
    const newItem = {
      id: `inv-${Date.now().toString().slice(-6)}`,
      category: itemInput.category || 'moldura',
      code: itemInput.code || `MOD-${Date.now().toString().slice(-2)}`,
      name: itemInput.name,
      stockMeters: parseFloat(itemInput.stockMeters) || 0,
      minStockMeters: parseFloat(itemInput.minStockMeters) || 10,
      costPerMeter: parseFloat(itemInput.costPerMeter) || 0,
      salePricePerMeter: parseFloat(itemInput.salePricePerMeter) || 0,
      unit: itemInput.unit || (itemInput.category === 'vidrio' ? 'm²' : 'm lineales')
    };

    setData(prev => ({
      ...prev,
      inventory: [newItem, ...prev.inventory]
    }));

    return newItem;
  };

  const deleteInventoryItem = (itemId) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== itemId)
    }));
  };

  const updateInventoryStock = (itemId, newStockMeters) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => 
        item.id === itemId ? { ...item, stockMeters: parseFloat(newStockMeters) } : item
      )
    }));
  };

  const updateInventoryItem = (itemId, updates) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  const updateCustomer = (customerId, updates) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.map(c =>
        c.id === customerId ? { ...c, ...updates } : c
      )
    }));
  };

  const updateOrder = (orderId, updates) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o =>
        o.id === orderId ? { ...o, ...updates } : o
      )
    }));
  };

  // --- TRANSACTIONS ACTIONS ---
  const addTransaction = (txInput) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: txInput.type || 'ingreso',
      category: txInput.category || 'cobro',
      concept: txInput.concept,
      amount: parseFloat(txInput.amount) || 0,
      paymentMethod: txInput.paymentMethod || 'Efectivo',
      orderId: txInput.orderId || null,
      isExample: false
    };

    setData(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));

    return newTx;
  };

  const updateTransaction = (txId, updates) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === txId ? { ...t, ...updates } : t
      )
    }));
  };

  const deleteTransaction = (txId) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== txId)
    }));
  };

  const clearAllDemoData = () => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => !o.isExample),
      trelloCards: prev.trelloCards.filter(c => !c.isExample),
      customers: prev.customers.filter(c => !c.isExample),
      inventory: prev.inventory.filter(i => !i.isExample),
      transactions: prev.transactions.filter(t => !t.isExample)
    }));
  };

  const resetToDefaults = () => {
    setData({
      customers: INITIAL_CUSTOMERS,
      inventory: INITIAL_INVENTORY,
      orders: INITIAL_ORDERS,
      trelloColumns: INITIAL_TRELLO_COLUMNS,
      trelloCards: INITIAL_TRELLO_CARDS,
      transactions: INITIAL_TRANSACTIONS
    });
  };

  const hasDemoData = Boolean(
    data.orders.some(o => o.isExample) ||
    data.customers.some(c => c.isExample) ||
    data.trelloCards.some(tc => tc.isExample)
  );

  return (
    <ErpDataContext.Provider
      value={{
        ...data,
        hasDemoData,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        moveTrelloCard,
        addTrelloCard,
        updateTrelloCard,
        deleteTrelloCard,
        toggleCardChecklistItem,
        addChecklistItemToCard,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateInventoryStock,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllDemoData,
        resetToDefaults
      }}
    >
      {children}
    </ErpDataContext.Provider>
  );
};

export const useErpData = () => {
  const context = useContext(ErpDataContext);
  if (!context) {
    throw new Error('useErpData debe ser usado dentro de un ErpDataProvider');
  }
  return context;
};
