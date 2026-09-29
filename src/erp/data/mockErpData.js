/**
 * Datos semilla y configuración inicial para el ERP y Trello de Sol & Sombra SRL.
 * Los datos iniciales están marcados con `isExample: true` para que se visualicen
 * de forma atenuada en gris como ejemplos didácticos hasta que el cliente cargue sus datos reales.
 */

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    email: 'admin@solysombra.com.py',
    password: 'admin',
    name: 'Guillermo Zarza',
    role: 'admin',
    title: 'Director General',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    email: 'ventas@solysombra.com.py',
    password: 'ventas',
    name: 'Mariana Benítez',
    role: 'ventas',
    title: 'Asesora de Ventas & Presupuestos',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    email: 'taller@solysombra.com.py',
    password: 'taller',
    name: 'Carlos Maidana',
    role: 'taller',
    title: 'Maestro Enmarcador & Taller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cli-101',
    name: 'Arq. Sofía Villalba',
    company: 'Estudio Villalba Arquitectura',
    phone: '+595981452100',
    email: 'sofia.villalba@estudio.com.py',
    document: '4.521.890-3',
    city: 'Asunción (Barrio Herrera)',
    notes: 'Cliente frecuente. Prefiere molduras minimalistas tipo 03 en negro mate.',
    totalOrders: 6,
    pendingBalance: 0,
    isExample: true
  },
  {
    id: 'cli-102',
    name: 'Dr. Fernando Cantero',
    company: 'Clínica San Roque',
    phone: '+595971234890',
    email: 'fcantero@clinicasanroque.py',
    document: '2.145.670-1',
    city: 'Fernando de la Mora',
    notes: 'Enmarca diplomas y fotos familiares grandes con vidrio mate antirreflejo.',
    totalOrders: 3,
    pendingBalance: 320000,
    isExample: true
  },
  {
    id: 'cli-103',
    name: 'Lic. Patricia Giménez',
    company: 'Galería Arte Vivo',
    phone: '+595983678120',
    email: 'patricia@galeriaartevivo.com',
    document: '3.890.112-8',
    city: 'San Bernardino',
    notes: 'Exige máxima precisión en paspartú libre de ácido para acuarelas.',
    totalOrders: 8,
    pendingBalance: 850000,
    isExample: true
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-m01',
    category: 'moldura',
    code: 'MOD-01',
    name: 'Moldura Metálica Chevron Envejecida (Oro/Bronce)',
    stockMeters: 48.5,
    minStockMeters: 15.0,
    costPerMeter: 45000,
    salePricePerMeter: 85000,
    unit: 'm lineales',
    isExample: true
  },
  {
    id: 'inv-m02',
    category: 'moldura',
    code: 'MOD-02',
    name: 'Moldura Madera Roble / Nogal Macizo Natural',
    stockMeters: 14.2,
    minStockMeters: 20.0,
    costPerMeter: 55000,
    salePricePerMeter: 110000,
    unit: 'm lineales',
    isExample: true
  },
  {
    id: 'inv-m03',
    category: 'moldura',
    code: 'MOD-03',
    name: 'Moldura Minimalista Lisa Negra / Blanca Mate',
    stockMeters: 86.0,
    minStockMeters: 25.0,
    costPerMeter: 38000,
    salePricePerMeter: 75000,
    unit: 'm lineales',
    isExample: true
  },
  {
    id: 'inv-m04',
    category: 'moldura',
    code: 'MOD-04',
    name: 'Moldura Biselada Aluminio Cepillado Plata',
    stockMeters: 22.0,
    minStockMeters: 15.0,
    costPerMeter: 50000,
    salePricePerMeter: 95000,
    unit: 'm lineales',
    isExample: true
  },
  {
    id: 'inv-v01',
    category: 'vidrio',
    code: 'VID-SEN',
    name: 'Vidrio Float Sencillo Cristal 2mm',
    stockMeters: 28.5,
    minStockMeters: 10.0,
    costPerMeter: 90000,
    salePricePerMeter: 180000,
    unit: 'm²',
    isExample: true
  },
  {
    id: 'inv-v02',
    category: 'vidrio',
    code: 'VID-MAT',
    name: 'Vidrio Mate Antirreflejo Especial 2mm',
    stockMeters: 8.2,
    minStockMeters: 12.0,
    costPerMeter: 110000,
    salePricePerMeter: 200000,
    unit: 'm²',
    isExample: true
  },
  {
    id: 'inv-p01',
    category: 'insumo',
    code: 'PAS-BLA',
    name: 'Paspartú Blanco Puro Libre de Ácido 80x120cm',
    stockMeters: 35,
    minStockMeters: 10,
    costPerMeter: 40000,
    salePricePerMeter: 80000,
    unit: 'planchas',
    isExample: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'SYS-2026-001',
    date: '2026-09-18',
    promiseDate: '2026-09-24',
    customerId: 'cli-101',
    customerName: 'Arq. Sofía Villalba',
    title: 'Serie 3 Planos Arquitectónicos A2',
    widthM: 0.60,
    heightM: 0.85,
    moldingCode: 'MOD-03',
    moldingName: 'Moldura Minimalista Lisa Negra Mate',
    moldingPrice: 75000,
    glassType: 'mate',
    glassName: 'Vidrio Mate Antirreflejo',
    paymentMethod: 'transferencia',
    totalPrice: 650000,
    deposit: 350000,
    balance: 300000,
    status: 'produccion',
    hasTrelloCard: true,
    trelloCardId: 'card-1',
    isExample: true
  },
  {
    id: 'SYS-2026-002',
    date: '2026-09-19',
    promiseDate: '2026-09-23',
    customerId: 'cli-102',
    customerName: 'Dr. Fernando Cantero',
    title: 'Diploma Especialización Médica + Medalla',
    widthM: 0.40,
    heightM: 0.50,
    moldingCode: 'MOD-02',
    moldingName: 'Moldura Madera Roble Macizo Natural',
    moldingPrice: 110000,
    glassType: 'sencillo',
    glassName: 'Vidrio Sencillo',
    paymentMethod: 'tarjeta',
    totalPrice: 420000,
    deposit: 100000,
    balance: 320000,
    status: 'produccion',
    hasTrelloCard: true,
    trelloCardId: 'card-2',
    isExample: true
  },
  {
    id: 'SYS-2026-003',
    date: '2026-09-20',
    promiseDate: '2026-09-22',
    customerId: 'cli-103',
    customerName: 'Lic. Patricia Giménez',
    title: 'Óleo Paisaje Ypacaraí 120x80cm',
    widthM: 1.20,
    heightM: 0.80,
    moldingCode: 'MOD-01',
    moldingName: 'Moldura Metálica Chevron Envejecida (Oro)',
    moldingPrice: 85000,
    glassType: 'sencillo',
    glassName: 'Sin Vidrio / Bastidor Reforzado',
    paymentMethod: 'transferencia',
    totalPrice: 1150000,
    deposit: 300000,
    balance: 850000,
    status: 'listo',
    hasTrelloCard: true,
    trelloCardId: 'card-3',
    isExample: true
  }
];

export const INITIAL_TRELLO_COLUMNS = [
  { id: 'col-nuevos', title: 'Pedidos Nuevos / Por Iniciar', color: 'border-blue-500' },
  { id: 'col-corte', title: 'Corte y Armado de Marco', color: 'border-amber-500' },
  { id: 'col-vidrio', title: 'Corte de Vidrio y Paspartú', color: 'border-cyan-500' },
  { id: 'col-montaje', title: 'Montaje, Sellado y Fondo', color: 'border-indigo-500' },
  { id: 'col-listo', title: 'Listo para Retiro / Notificar', color: 'border-emerald-500' },
  { id: 'col-entregado', title: 'Entregado / Concretado', color: 'border-gray-400' }
];

export const INITIAL_TRELLO_CARDS = [
  {
    id: 'card-2',
    columnId: 'col-corte',
    orderId: 'SYS-2026-002',
    title: 'Diploma Especialización Dr. Cantero (40x50cm)',
    customerName: 'Dr. Fernando Cantero',
    priority: 'urgente',
    dueDate: '2026-09-23',
    assignedTo: 'Carlos Maidana',
    tags: ['Diplomas', 'Roble Macizo', 'Urgente'],
    description: 'El cliente lo necesita para acto protocolar el jueves por la mañana sin falta.',
    checklists: [
      { id: 'chk-5', text: 'Ingleteado a 45° de Roble MOD-02', done: true },
      { id: 'chk-6', text: 'Encolado y prensado neumático', done: true },
      { id: 'chk-7', text: 'Lijado suave y cera protectora en esquinas', done: false }
    ],
    isExample: true
  },
  {
    id: 'card-1',
    columnId: 'col-vidrio',
    orderId: 'SYS-2026-001',
    title: 'Serie Planos Arquitectura (3 cuadros 60x85cm)',
    customerName: 'Arq. Sofía Villalba',
    priority: 'normal',
    dueDate: '2026-09-24',
    assignedTo: 'Carlos Maidana',
    tags: ['Planos', 'Vidrio Mate', 'Minimalista'],
    description: 'Corte de 3 vidrios mate antirreflejo y paspartú perimetral de 4cm blanco puro.',
    checklists: [
      { id: 'chk-8', text: 'Armado de 3 marcos MOD-03 Negro', done: true },
      { id: 'chk-9', text: 'Corte de 3 vidrios mate 60x85', done: false },
      { id: 'chk-10', text: 'Corte en bisel de ventanas de paspartú', done: false }
    ],
    isExample: true
  },
  {
    id: 'card-3',
    columnId: 'col-listo',
    orderId: 'SYS-2026-003',
    title: 'Óleo Paisaje Ypacaraí (120x80cm)',
    customerName: 'Lic. Patricia Giménez',
    priority: 'normal',
    dueDate: '2026-09-22',
    assignedTo: 'Mariana Benítez',
    tags: ['Óleo', 'Galería de Arte', 'Moldura Oro'],
    description: 'Terminado con alambre de acero y esquineros de protección para transporte.',
    checklists: [
      { id: 'chk-11', text: 'Montaje de bastidor con flejes', done: true },
      { id: 'chk-12', text: 'Papel kraft antihumedad en dorso', done: true },
      { id: 'chk-13', text: 'Notificar a clienta por WhatsApp (saldo Gs 850.000)', done: true }
    ],
    isExample: true
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-001',
    date: '2026-09-18',
    type: 'ingreso',
    category: 'seña',
    concept: 'Seña 50% Pedido SYS-2026-001 (Arq. Sofía Villalba)',
    amount: 350000,
    paymentMethod: 'Transferencia Bancaria (Itaú)',
    orderId: 'SYS-2026-001',
    isExample: true
  },
  {
    id: 'tx-002',
    date: '2026-09-19',
    type: 'ingreso',
    category: 'seña',
    concept: 'Seña Pedido SYS-2026-002 (Dr. Fernando Cantero)',
    amount: 100000,
    paymentMethod: 'Tarjeta de Crédito (POS Dinelco)',
    orderId: 'SYS-2026-002',
    isExample: true
  },
  {
    id: 'tx-003',
    date: '2026-09-20',
    type: 'ingreso',
    category: 'seña',
    concept: 'Seña Pedido SYS-2026-003 (Lic. Patricia Giménez)',
    amount: 300000,
    paymentMethod: 'Transferencia Bancaria (Continental)',
    orderId: 'SYS-2026-003',
    isExample: true
  }
];
