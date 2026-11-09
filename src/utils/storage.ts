import { ClientCredit, ProductItem, PurchaseExpense, AppSettings, Installment } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'amanah_clients_v1',
  PRODUCTS: 'amanah_products_v1',
  EXPENSES: 'amanah_expenses_v1',
  SETTINGS: 'amanah_settings_v1',
  PIN_CODE: 'amanah_pin_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  pinCode: '1234',
  sellerName: 'Adil Kziz',
  sellerBusinessName: 'TAYSIR - تيسير لتسهيلات التقسيط والأجهزة',
  sellerPhone: '+20 10 1234 5678',
  sellerWhatsapp: '+20 10 1234 5678',
  sellerAddress: 'شارع الحرية، الدقي، الجيزة / القاهرة، مصر',
  sellerNationalId: '28911010104589',
  currency: 'EGP / ج.م',
  vodafoneCashNumber: '01012345678',
  fawryServiceNumber: '78912',
  instapayHandle: 'taysir.pay@instapay',
  paypalEmail: 'payment@taysir.eg',
  bankDetails: 'بنك مصر - حساب: 1280034892019',
  reminderTemplate: 'تذكير بميعاد القسط الشهري القادم.',
  overdueTemplate: 'تنبيه عاجل بسداد القسط الشهري المتأخر.',
};

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Smart TV Samsung 43" UHD 4K',
    category: 'tv',
    brand: 'Samsung',
    model: 'Crystal UHD 43AU7000',
    suggestedCostPrice: 1000,
    suggestedSalePrice: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    description: 'Écran 4K Ultra HD avec récepteur satellite intégré, applications Netflix et Shahid',
  },
  {
    id: 'prod-2',
    name: 'Smart TV LG 55" NanoCell 4K',
    category: 'tv',
    brand: 'LG',
    model: '55NANO776RA',
    suggestedCostPrice: 2200,
    suggestedSalePrice: 2700,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    description: 'Téléviseur grand format avec technologie HDR10 et télécommande Magic Remote',
  },
  {
    id: 'prod-3',
    name: 'Réfrigérateur LG No Frost 14 Pieds',
    category: 'electromenager',
    brand: 'LG',
    model: 'GN-B392SLCL',
    suggestedCostPrice: 3200,
    suggestedSalePrice: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    description: 'Technologie DoorCooling+, compresseur Smart Inverter garantie 10 ans',
  },
  {
    id: 'prod-4',
    name: 'Machine à laver Toshiba 8 kg Automatique',
    category: 'electromenager',
    brand: 'Toshiba',
    model: 'AW-DUJ1000MN',
    suggestedCostPrice: 1900,
    suggestedSalePrice: 2350,
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    description: 'Lave-linge chargement par le haut avec moteur à entraînement direct silencieux',
  },
  {
    id: 'prod-5',
    name: 'Cuisinière Fresh Plaza 5 Feux Inox',
    category: 'electromenager',
    brand: 'Fresh',
    model: 'Plaza 60x90 Full Inox',
    suggestedCostPrice: 1600,
    suggestedSalePrice: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Four grande capacité avec tournebroche et allumage automatique complet',
  },
  {
    id: 'prod-6',
    name: 'Climatiseur Sharp 1.5 CV Froid/Chaud',
    category: 'climatisation',
    brand: 'Sharp',
    model: 'AH-AP12UHE',
    suggestedCostPrice: 2800,
    suggestedSalePrice: 3450,
    imageUrl: 'https://images.unsplash.com/photo-1614633833026-0e241777b797?auto=format&fit=crop&w=600&q=80',
    description: 'Technologie Plasmacluster ionique purificateur d air et fonction super jet',
  },
  {
    id: 'prod-7',
    name: 'Récepteur Satellite 4K + Parabole HD',
    category: 'parabole_tech',
    brand: 'Senator',
    model: 'Senator Prime 4040',
    suggestedCostPrice: 350,
    suggestedSalePrice: 500,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    description: 'Décodeur numérique haute définition avec antenne parabole 80cm et câble inclus',
  },
];

// Helper to generate dates relative to current date
function getDateOffset(monthsOffset: number, dayOfMonth: number = 5): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsOffset);
  d.setDate(dayOfMonth);
  return d.toISOString().split('T')[0];
}

export const INITIAL_CLIENTS: ClientCredit[] = [
  {
    id: 'client-1',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    contractNumber: 'CTR-2026-001',
    fullName: 'Ahmed Mahmoud Hassan',
    phone: '01098765432',
    whatsapp: '01098765432',
    nationalId: '29304151201948',
    address: '14 Rue El-Nasr, Bâtiment 4, Appt 12',
    city: 'Le Caire / Dokki',
    guarantorName: 'Mohamed Mahmoud Hassan (Frère)',
    guarantorPhone: '01123456789',
    guarantorAddress: '18 Rue El-Nasr, Dokki',
    guarantorRelation: 'Frère aîné',
    guarantorNationalId: '28807121201452',
    productName: 'Smart TV Samsung 43" UHD 4K',
    productCategory: 'tv',
    productCostPrice: 1000,
    advancePayment: 200,
    profitMargin: 200,
    totalPrice: 1200,
    remainingBalance: 1000,
    numberOfMonths: 3,
    monthlyInstallmentAmount: 333.33,
    preferredPaymentMethod: 'vodafone_cash',
    status: 'active',
    notes: 'Exemple parfait : Achat TV à 1000 EGP, avance de 200 EGP, durée 3 mois avec traite de ~333 EGP.',
    installments: [
      {
        id: 'inst-1-1',
        number: 1,
        dueDate: getDateOffset(-1, 5), // Payé le mois dernier
        amount: 334,
        status: 'paid',
        paidDate: getDateOffset(-1, 4),
        paymentMethod: 'vodafone_cash',
        receiptNumber: 'REC-00142',
      },
      {
        id: 'inst-1-2',
        number: 2,
        dueDate: getDateOffset(0, 1), // Échue au 1er de ce mois -> EN RETARD
        amount: 333,
        status: 'overdue',
        notes: 'Promesse de virement par Vodafone Cash',
      },
      {
        id: 'inst-1-3',
        number: 3,
        dueDate: getDateOffset(1, 5), // Prochain mois
        amount: 333,
        status: 'pending',
      },
    ],
  },
  {
    id: 'client-2',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    contractNumber: 'CTR-2026-002',
    fullName: 'Mariam El-Sayed Soliman',
    phone: '01234567890',
    whatsapp: '01234567890',
    nationalId: '29608140103492',
    address: '22 Avenue Al-Galaa, Immeuble Al-Ahram',
    city: 'Gizeh / Haram',
    guarantorName: 'Sayed Soliman (Père)',
    guarantorPhone: '01011223344',
    guarantorAddress: 'Même adresse, Haram',
    guarantorRelation: 'Père',
    guarantorNationalId: '26503110101923',
    productName: 'Réfrigérateur LG No Frost 14 Pieds',
    productCategory: 'electromenager',
    productCostPrice: 3200,
    advancePayment: 800,
    profitMargin: 600,
    totalPrice: 3800,
    remainingBalance: 3000,
    numberOfMonths: 6,
    monthlyInstallmentAmount: 500,
    preferredPaymentMethod: 'instapay',
    status: 'active',
    notes: 'Cliente très ponctuelle, paiements réguliers via InstaPay.',
    installments: [
      {
        id: 'inst-2-1',
        number: 1,
        dueDate: getDateOffset(-2, 10),
        amount: 500,
        status: 'paid',
        paidDate: getDateOffset(-2, 9),
        paymentMethod: 'instapay',
        receiptNumber: 'INS-88231',
      },
      {
        id: 'inst-2-2',
        number: 2,
        dueDate: getDateOffset(-1, 10),
        amount: 500,
        status: 'paid',
        paidDate: getDateOffset(-1, 10),
        paymentMethod: 'instapay',
        receiptNumber: 'INS-90112',
      },
      {
        id: 'inst-2-3',
        number: 3,
        dueDate: getDateOffset(0, 10), // Échéance à venir ce mois-ci
        amount: 500,
        status: 'pending',
      },
      {
        id: 'inst-2-4',
        number: 4,
        dueDate: getDateOffset(1, 10),
        amount: 500,
        status: 'pending',
      },
      {
        id: 'inst-2-5',
        number: 5,
        dueDate: getDateOffset(2, 10),
        amount: 500,
        status: 'pending',
      },
      {
        id: 'inst-2-6',
        number: 6,
        dueDate: getDateOffset(3, 10),
        amount: 500,
        status: 'pending',
      },
    ],
  },
  {
    id: 'client-3',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    contractNumber: 'CTR-2026-003',
    fullName: 'Youssef Ibrahim Mostafa',
    phone: '01555667788',
    whatsapp: '01555667788',
    nationalId: '29105220108741',
    address: '7 Rue Kasr El-Nil, Centre-ville',
    city: 'Le Caire',
    guarantorName: 'Tarek Ibrahim Mostafa',
    guarantorPhone: '01099887766',
    guarantorAddress: '15 Rue Kasr El-Nil',
    guarantorRelation: 'Cousin',
    guarantorNationalId: '28906150102384',
    productName: 'Machine à laver Toshiba 8 kg Automatique',
    productCategory: 'electromenager',
    productCostPrice: 1900,
    advancePayment: 400,
    profitMargin: 450,
    totalPrice: 2350,
    remainingBalance: 1950,
    numberOfMonths: 3,
    monthlyInstallmentAmount: 650,
    preferredPaymentMethod: 'fawry',
    status: 'active',
    notes: 'Paiement prévu via code Fawry.',
    installments: [
      {
        id: 'inst-3-1',
        number: 1,
        dueDate: getDateOffset(0, -3), // Date déjà passée -> En retard
        amount: 650,
        status: 'overdue',
        notes: 'En attente de versement Fawry',
      },
      {
        id: 'inst-3-2',
        number: 2,
        dueDate: getDateOffset(1, 15),
        amount: 650,
        status: 'pending',
      },
      {
        id: 'inst-3-3',
        number: 3,
        dueDate: getDateOffset(2, 15),
        amount: 650,
        status: 'pending',
      },
    ],
  },
  {
    id: 'client-4',
    createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    contractNumber: 'CTR-2026-004',
    fullName: 'Fatima Abdel-Rahman',
    phone: '01144332211',
    whatsapp: '01144332211',
    nationalId: '29411030105678',
    address: '34 Rue Al-Bahr, Shubra',
    city: 'Le Caire',
    guarantorName: 'Abdel-Rahman Hassan',
    guarantorPhone: '01222113344',
    guarantorAddress: '34 Rue Al-Bahr, Shubra',
    guarantorRelation: 'Père',
    guarantorNationalId: '26002010103412',
    productName: 'Cuisinière Fresh Plaza 5 Feux Inox',
    productCategory: 'electromenager',
    productCostPrice: 1600,
    advancePayment: 500,
    profitMargin: 400,
    totalPrice: 2000,
    remainingBalance: 1500,
    numberOfMonths: 3,
    monthlyInstallmentAmount: 500,
    preferredPaymentMethod: 'cash',
    status: 'completed',
    notes: 'Crédit entièrement soldé avec succès !',
    installments: [
      {
        id: 'inst-4-1',
        number: 1,
        dueDate: getDateOffset(-3, 1),
        amount: 500,
        status: 'paid',
        paidDate: getDateOffset(-3, 1),
        paymentMethod: 'cash',
        receiptNumber: 'REC-00089',
      },
      {
        id: 'inst-4-2',
        number: 2,
        dueDate: getDateOffset(-2, 1),
        amount: 500,
        status: 'paid',
        paidDate: getDateOffset(-2, 2),
        paymentMethod: 'cash',
        receiptNumber: 'REC-00104',
      },
      {
        id: 'inst-4-3',
        number: 3,
        dueDate: getDateOffset(-1, 1),
        amount: 500,
        status: 'paid',
        paidDate: getDateOffset(-1, 1),
        paymentMethod: 'cash',
        receiptNumber: 'REC-00122',
      },
    ],
  },
];

export const INITIAL_EXPENSES: PurchaseExpense[] = [
  {
    id: 'exp-1',
    date: getDateOffset(-1, 2),
    productName: 'Smart TV Samsung 43" UHD 4K',
    category: 'tv',
    supplier: 'Grossiste Al-Araby Group, Ataba',
    purchasePrice: 1000,
    invoiceNumber: 'FAC-ARB-8491',
    assignedClientName: 'Ahmed Mahmoud Hassan',
    notes: 'Achat téléviseur pour client Ahmed (contrat CTR-2026-001)',
  },
  {
    id: 'exp-2',
    date: getDateOffset(-2, 5),
    productName: 'Réfrigérateur LG No Frost 14 Pieds',
    category: 'electromenager',
    supplier: 'LG Égypte Showroom / Distributeur',
    purchasePrice: 3200,
    invoiceNumber: 'FAC-LG-2910',
    assignedClientName: 'Mariam El-Sayed Soliman',
    notes: 'Garantie 10 ans sur compresseur livrée au client',
  },
  {
    id: 'exp-3',
    date: getDateOffset(0, -4),
    productName: 'Machine à laver Toshiba 8 kg Automatique',
    category: 'electromenager',
    supplier: 'Elaraby Store Mall of Arabia',
    purchasePrice: 1900,
    invoiceNumber: 'INV-77382',
    assignedClientName: 'Youssef Ibrahim Mostafa',
  },
  {
    id: 'exp-4',
    date: getDateOffset(-3, 1),
    productName: 'Cuisinière Fresh Plaza 5 Feux Inox',
    category: 'electromenager',
    supplier: 'Fresh Electric Factory Outlet',
    purchasePrice: 1600,
    invoiceNumber: 'FR-99102',
    assignedClientName: 'Fatima Abdel-Rahman',
  },
];

// Helper to auto-refresh installment statuses (Red if past due and unpaid, Green if paid)
export function updateInstallmentsRealtime(installments: Installment[]): Installment[] {
  const today = new Date().toISOString().split('T')[0];
  return installments.map(inst => {
    if (inst.status === 'paid') return inst;
    // Si c'est un mois impayé décalé, il reste en rouge (overdue)
    if (inst.isUnpaidDeferred) {
      return { ...inst, status: 'overdue' };
    }
    if (inst.dueDate < today) {
      return { ...inst, status: 'overdue' };
    }
    return { ...inst, status: 'pending' };
  });
}

/**
 * Calcule la prochaine date d'échéance à la fin du contrat (+1 mois après la dernière traite)
 */
export function calculateNextDeferredDate(installments: Installment[]): string {
  if (installments.length === 0) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  }
  const dates = installments.map(i => i.dueDate).sort();
  const latestDateStr = dates[dates.length - 1];
  const d = new Date(latestDateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * Décalage de la traite impayée à la fin du contrat :
 * 1. Marque le mois d'origine comme IMPAYÉ (STATUT ROUGE)
 * 2. Ajoute une nouvelle traite à la fin du contrat (date fin + 1 mois)
 */
export function deferInstallmentToEnd(client: ClientCredit, installmentId: string): ClientCredit {
  const target = client.installments.find(i => i.id === installmentId);
  if (!target || target.isUnpaidDeferred) return client;

  const today = new Date().toISOString().split('T')[0];
  const newEndDate = calculateNextDeferredDate(client.installments);
  const nextNumber = client.installments.length + 1;

  // 1. Mettre à jour la traite d'origine en impayée décalée
  const updatedInstallments = client.installments.map(inst => {
    if (inst.id === installmentId) {
      return {
        ...inst,
        status: 'overdue' as const,
        isUnpaidDeferred: true,
        originalDueDate: inst.dueDate,
        deferredToDate: newEndDate,
        deferralDate: today,
        notes: `Mois ${inst.number} impayé (non remboursé) - Décalé à la fin (${newEndDate})`,
      };
    }
    return inst;
  });

  // 2. Ajouter la traite reportée à la fin du contrat
  const deferredExtension: Installment = {
    id: `inst-deferred-${Date.now()}-${target.number}`,
    number: nextNumber,
    dueDate: newEndDate,
    amount: target.amount,
    status: 'pending',
    isDeferredExtension: true,
    deferredFromMonth: target.number,
    originalDueDate: target.dueDate,
    notes: `Report de la traite N°${target.number} impayée (Nouvelle date de fin)`,
  };

  const finalInstallments = [...updatedInstallments, deferredExtension];

  return syncClientStatus({
    ...client,
    installments: finalInstallments,
    numberOfMonths: finalInstallments.filter(i => !i.isUnpaidDeferred).length,
  });
}

/**
 * Annuler le décalage d'une traite
 */
export function undoDeferInstallment(client: ClientCredit, installmentId: string): ClientCredit {
  const target = client.installments.find(i => i.id === installmentId);
  if (!target || !target.isUnpaidDeferred) return client;

  // Retirer l'extension ajoutée à la fin pour cette traite
  const withoutExtension = client.installments.filter(
    i => !(i.isDeferredExtension && i.deferredFromMonth === target.number)
  );

  // Rétablir la traite d'origine
  const today = new Date().toISOString().split('T')[0];
  const restoredInstallments = withoutExtension.map(inst => {
    if (inst.id === installmentId) {
      const isPast = inst.dueDate <= today;
      return {
        ...inst,
        status: (isPast ? 'overdue' : 'pending') as 'overdue' | 'pending',
        isUnpaidDeferred: false,
        deferredToDate: undefined,
        deferralDate: undefined,
        notes: undefined,
      };
    }
    return inst;
  });

  return syncClientStatus({
    ...client,
    installments: restoredInstallments,
    numberOfMonths: restoredInstallments.length,
  });
}

export function syncClientStatus(client: ClientCredit): ClientCredit {
  const updatedInstallments = updateInstallmentsRealtime(client.installments);
  // Les traites actives à payer (on ignore les historiques isUnpaidDeferred pour le solde payé)
  const payableInstallments = updatedInstallments.filter(i => !i.isUnpaidDeferred);
  const allPaid = payableInstallments.every(i => i.status === 'paid');
  const hasOverdue = updatedInstallments.some(i => i.status === 'overdue' && !i.isUnpaidDeferred);
  
  let status: 'active' | 'completed' | 'defaulted' = client.status;
  if (allPaid && payableInstallments.length > 0) {
    status = 'completed';
  } else if (hasOverdue) {
    status = 'active';
  } else {
    status = 'active';
  }

  return {
    ...client,
    installments: updatedInstallments,
    status,
  };
}

// STORAGE API
export function loadClients(): ClientCredit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      saveClients(INITIAL_CLIENTS);
      return INITIAL_CLIENTS;
    }
    const parsed: ClientCredit[] = JSON.parse(raw);
    return parsed.map(syncClientStatus);
  } catch (e) {
    console.error('Error loading clients from local storage', e);
    return INITIAL_CLIENTS;
  }
}

export function saveClients(clients: ClientCredit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients', e);
  }
}

export function loadProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: ProductItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products', e);
  }
}

export function loadExpenses(): PurchaseExpense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      saveExpenses(INITIAL_EXPENSES);
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: PurchaseExpense[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (e) {
    console.error('Error saving expenses', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function exportDatabaseBackup(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    clients: loadClients(),
    products: loadProducts(),
    expenses: loadExpenses(),
    settings: loadSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabaseBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.clients && Array.isArray(data.clients)) {
      saveClients(data.clients);
    }
    if (data.products && Array.isArray(data.products)) {
      saveProducts(data.products);
    }
    if (data.expenses && Array.isArray(data.expenses)) {
      saveExpenses(data.expenses);
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON', e);
    return false;
  }
}
