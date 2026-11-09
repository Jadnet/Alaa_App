import React, { useState, useEffect } from 'react';
import { ClientCredit, ProductItem, PurchaseExpense, AppSettings } from './types';
import {
  loadClients,
  saveClients,
  loadProducts,
  saveProducts,
  loadExpenses,
  saveExpenses,
  loadSettings,
  saveSettings,
  syncClientStatus,
} from './utils/storage';
import { Language, getStoredLanguage, saveStoredLanguage } from './utils/translations';
import { PinLockScreen } from './components/PinLockScreen';
import { TopHeader } from './components/TopHeader';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { CatalogView } from './components/CatalogView';
import { ContractsView } from './components/ContractsView';
import { SettingsView } from './components/SettingsView';
import { ClientDetailModal } from './components/ClientDetailModal';
import { NewCreditModal } from './components/NewCreditModal';
import { ContractPdfModal } from './components/ContractPdfModal';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  // Dual Language State (English & Arabic)
  const [lang, setLang] = useState<Language>(getStoredLanguage());

  // App State
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);

  // Data State
  const [clients, setClients] = useState<ClientCredit[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [expenses, setExpenses] = useState<PurchaseExpense[]>([]);
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  // Modals
  const [selectedClientDetail, setSelectedClientDetail] = useState<ClientCredit | null>(null);
  const [selectedClientContract, setSelectedClientContract] = useState<ClientCredit | null>(null);
  const [isNewCreditOpen, setIsNewCreditOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Synchronize document direction with selected language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const loadedClients = loadClients();
    const loadedProducts = loadProducts();
    const loadedExpenses = loadExpenses();
    const loadedSettings = loadSettings();

    setClients(loadedClients);
    setProducts(loadedProducts);
    setExpenses(loadedExpenses);
    setSettings(loadedSettings);
  }, []);

  // Sync clients whenever modified
  const handleUpdateClient = (updated: ClientCredit) => {
    const synced = syncClientStatus(updated);
    const updatedList = clients.map((c) => (c.id === synced.id ? synced : c));
    setClients(updatedList);
    saveClients(updatedList);
    setSelectedClientDetail(synced);
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedList = clients.filter((c) => c.id !== clientId);
    setClients(updatedList);
    saveClients(updatedList);
    setSelectedClientDetail(null);
  };

  const handleSaveNewClient = (newClient: ClientCredit, logExpense: boolean) => {
    const synced = syncClientStatus(newClient);
    const updatedList = [synced, ...clients];
    setClients(updatedList);
    saveClients(updatedList);

    // If option checked, also record in purchases/expenses history
    if (logExpense) {
      const newExp: PurchaseExpense = {
        id: `exp-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        productName: newClient.productName,
        category: newClient.productCategory,
        supplier: 'Achat pour client (Départ crédit)',
        purchasePrice: newClient.productCostPrice,
        invoiceNumber: newClient.contractNumber,
        assignedClientName: newClient.fullName,
        notes: `Article pour le contrat ${newClient.contractNumber}`,
      };
      const updatedExpenses = [newExp, ...expenses];
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
    }

    // Open detail for the newly created client
    setSelectedClientDetail(synced);
  };

  const handleAddProduct = (prod: ProductItem) => {
    const updated = [prod, ...products];
    setProducts(updated);
    saveProducts(updated);
  };

  const handleAddExpense = (exp: PurchaseExpense) => {
    const updated = [exp, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleRefreshData = () => {
    setClients(loadClients());
    setProducts(loadProducts());
    setExpenses(loadExpenses());
    setSettings(loadSettings());
  };

  const handleSelectProductForCredit = (prod: ProductItem) => {
    setIsNewCreditOpen(true);
  };

  // Counts for alerts (only count active overdue months that haven't been shifted to the end yet)
  const overdueCount = clients.filter((c) =>
    c.installments.some((i) => i.status === 'overdue' && !i.isUnpaidDeferred)
  ).length;

  const today = new Date().toISOString().split('T')[0];
  const dueTodayCount = clients.filter((c) =>
    c.installments.some((i) => i.status === 'pending' && i.dueDate === today)
  ).length;

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#1B2516] sm:bg-[#EAE4DC] flex items-center justify-center ${
        lang === 'ar' ? 'font-arabic' : 'font-sans'
      } antialiased text-[#24321D]`}
    >
      {/* 4-DIGIT PIN SECURITY LOCK SCREEN WITH GLISSIÈRE / SLIDER = NEXT */}
      {isLocked && (
        <PinLockScreen
          correctPin={settings.pinCode || '1234'}
          onUnlocked={() => setIsLocked(false)}
          sellerBusinessName={settings.sellerBusinessName}
          lang={lang}
          onToggleLang={handleToggleLang}
        />
      )}

      {/* Main Container: Mobile phone viewport or Fullscreen */}
      <div
        className={`w-full bg-[#FAF8F5] flex flex-col min-h-screen transition-all ${
          isMobileDeviceView
            ? 'max-w-md sm:my-4 sm:rounded-[44px] shadow-2xl sm:border-[8px] sm:border-[#24321D] overflow-hidden sm:min-h-[844px] sm:max-h-[92vh]'
            : 'max-w-xl mx-auto shadow-2xl border-x border-stone-300'
        }`}
      >
        {/* Top Header Bar */}
        <TopHeader
          onLock={() => setIsLocked(true)}
          overdueCount={overdueCount}
          dueTodayCount={dueTodayCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          isMobileDeviceView={isMobileDeviceView}
          onToggleDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
          lang={lang}
          onToggleLang={handleToggleLang}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <DashboardView
              clients={clients}
              expenses={expenses}
              onOpenNewClient={() => setIsNewCreditOpen(true)}
              onSelectClient={(c) => setSelectedClientDetail(c)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              settings={settings}
              lang={lang}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onSelectClient={(c) => setSelectedClientDetail(c)}
              onOpenNewClient={() => setIsNewCreditOpen(true)}
              settings={settings}
              lang={lang}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogView
              products={products}
              expenses={expenses}
              onAddProduct={handleAddProduct}
              onAddExpense={handleAddExpense}
              onSelectProductForCredit={handleSelectProductForCredit}
              currency={settings.currency}
              lang={lang}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractsView
              clients={clients}
              onOpenContractPreview={(c) => setSelectedClientContract(c)}
              onSelectClient={(c) => setSelectedClientDetail(c)}
              settings={settings}
              lang={lang}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onRefreshData={handleRefreshData}
              lang={lang}
              onToggleLang={handleToggleLang}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          overdueCount={overdueCount}
          lang={lang}
        />
      </div>

      {/* MODALS */}
      {/* 1. Client Detail & Payment Tracker Modal */}
      <ClientDetailModal
        client={selectedClientDetail}
        isOpen={Boolean(selectedClientDetail)}
        onClose={() => setSelectedClientDetail(null)}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        onOpenContractPreview={(c) => setSelectedClientContract(c)}
        settings={settings}
        lang={lang}
      />

      {/* 2. New Credit Simulator & Technical Sheet Modal */}
      <NewCreditModal
        isOpen={isNewCreditOpen}
        onClose={() => setIsNewCreditOpen(false)}
        onSave={handleSaveNewClient}
        products={products}
        currency={settings.currency}
        lang={lang}
      />

      {/* 3. Official Printable Contract PDF Modal with Signatures */}
      <ContractPdfModal
        client={selectedClientContract}
        isOpen={Boolean(selectedClientContract)}
        onClose={() => setSelectedClientContract(null)}
        settings={settings}
        lang={lang}
      />

      {/* 4. Notifications & Urgent Reminders Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        clients={clients}
        settings={settings}
        onSelectClient={(c) => {
          setIsNotificationsOpen(false);
          setSelectedClientDetail(c);
        }}
        lang={lang}
      />
    </div>
  );
}
