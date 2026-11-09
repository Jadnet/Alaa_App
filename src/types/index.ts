export type PaymentMethod =
  | 'vodafone_cash'
  | 'fawry'
  | 'instapay'
  | 'orange_cash'
  | 'etisalat_cash'
  | 'cash'
  | 'paypal'
  | 'bank_transfer';

export type ProductCategory =
  | 'tv'
  | 'electromenager'
  | 'climatisation'
  | 'mobilier'
  | 'parabole_tech'
  | 'autre';

export interface Installment {
  id: string;
  number: number;
  dueDate: string; // YYYY-MM-DD
  amount: number; // in EGP
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  receiptNumber?: string;
  notes?: string;
  // Gestion du décalage à la fin de date fin (Report d'impayé)
  isUnpaidDeferred?: boolean; // Vrai si ce mois a été marqué impayé et reporté à la fin
  isDeferredExtension?: boolean; // Vrai s'il s'agit de la nouvelle traite ajoutée à la fin
  deferredFromMonth?: number; // Numéro du mois d'origine impayé
  originalDueDate?: string; // Date d'échéance initiale
  deferredToDate?: string; // Nouvelle date d'échéance à la fin du contrat
  deferralDate?: string; // Date où le report a été déclenché
}

export interface ClientCredit {
  id: string;
  createdAt: string;
  contractNumber: string;
  
  // Client Info (Fiche technique)
  fullName: string;
  phone: string;
  whatsapp?: string;
  nationalId: string; // Carte d'identité nationale / الرقم القومي
  address: string;
  city: string;
  
  // Guarantor Info (Garant / Caution)
  guarantorName: string;
  guarantorPhone: string;
  guarantorAddress: string;
  guarantorRelation: string;
  guarantorNationalId: string;
  
  // Product & Financial Info
  productName: string;
  productCategory: ProductCategory;
  productCostPrice: number; // Prix d'achat pour le vendeur (ex: 1000 EGP)
  advancePayment: number; // Avance payée (ex: 200 EGP)
  profitMargin: number; // Bénéfice ajouté (ex: 150 EGP)
  totalPrice: number; // Prix total de vente (cost + profit)
  remainingBalance: number; // Restant à payer (totalPrice - advancePayment)
  numberOfMonths: number; // Durée en mois (ex: 3 mois)
  monthlyInstallmentAmount: number; // Montant par traite
  preferredPaymentMethod: PaymentMethod;
  
  // Schedule
  installments: Installment[];
  status: 'active' | 'completed' | 'defaulted';
  notes?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  model: string;
  suggestedCostPrice: number; // Prix d'achat indicatif (EGP)
  suggestedSalePrice: number; // Prix de vente indicatif (EGP)
  imageUrl: string;
  description: string;
  isCustom?: boolean;
}

export interface PurchaseExpense {
  id: string;
  date: string;
  productName: string;
  category: ProductCategory;
  supplier: string;
  purchasePrice: number; // Dépense en EGP
  invoiceNumber?: string;
  assignedClientName?: string;
  notes?: string;
}

export interface AppSettings {
  pinCode: string;
  sellerName: string;
  sellerBusinessName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerAddress: string;
  sellerNationalId: string;
  currency: string;
  // Egyptian Payment details to show in reminders/invoices:
  vodafoneCashNumber: string;
  fawryServiceNumber: string;
  instapayHandle: string;
  paypalEmail: string;
  bankDetails: string;
  // Default reminder message
  reminderTemplate: string;
  overdueTemplate: string;
}
