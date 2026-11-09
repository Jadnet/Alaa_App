import React, { useState, useId } from 'react';
import {
  Search,
  Plus,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Tv,
  Refrigerator,
  Wind,
  Sofa,
  Radio,
  Package,
  Filter,
} from 'lucide-react';
import { ClientCredit, ProductCategory, AppSettings } from '../types';
import { formatCurrency, openWhatsAppDirect, callPhoneDirect, generateWhatsAppMessage } from '../utils/whatsapp';
import { Language, translations } from '../utils/translations';

interface ClientsViewProps {
  clients: ClientCredit[];
  onSelectClient: (client: ClientCredit) => void;
  onOpenNewClient: () => void;
  settings: AppSettings;
  lang: Language;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onSelectClient,
  onOpenNewClient,
  settings,
  lang,
}) => {
  const t = translations[lang];
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'overdue' | 'uptodate' | 'completed'>('all');

  // Category Icon helper
  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'electromenager':
        return <Refrigerator className="w-4 h-4" />;
      case 'climatisation':
        return <Wind className="w-4 h-4" />;
      case 'mobilier':
        return <Sofa className="w-4 h-4" />;
      case 'parabole_tech':
        return <Radio className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const hasOverdue = c.installments.some((i) => i.status === 'overdue' && !i.isUnpaidDeferred);
    const payableInsts = c.installments.filter((i) => !i.isUnpaidDeferred);
    const isCompleted = c.status === 'completed' || payableInsts.every((i) => i.status === 'paid');

    if (filterTab === 'overdue') return hasOverdue;
    if (filterTab === 'uptodate') return !hasOverdue && !isCompleted;
    if (filterTab === 'completed') return isCompleted;
    return true;
  });

  const overdueCount = clients.filter((c) =>
    c.installments.some((i) => i.status === 'overdue' && !i.isUnpaidDeferred)
  ).length;
  const activeCount = clients.filter((c) => c.status !== 'completed').length;
  const completedCount = clients.filter((c) => c.status === 'completed').length;

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 text-[#24321D]">
      {/* Title & Add Client Bar */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C29B38]">
            {t.clientDirectory}
          </span>
          <h2 className="text-xl font-serif font-bold text-[#24321D]">
            {t.navClients}
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenNewClient}
          className="py-2 px-3.5 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C29B38]" />
          <span>{t.newCreditBtn}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <label htmlFor={searchInputId} className="sr-only">
          {t.searchPlaceholder}
        </label>
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400 rtl:left-auto rtl:right-3.5" />
        <input
          id={searchInputId}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3 rtl:right-auto rtl:left-3.5 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs in Warm Sand & Olive */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#24321D] text-white shadow-xs font-bold'
              : 'bg-[#ECE5DC] text-stone-700 hover:bg-[#E2D8CC]'
          }`}
        >
          {t.tabAll} ({clients.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('overdue')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            filterTab === 'overdue'
              ? 'bg-rose-600 text-white shadow-xs font-bold animate-pulse'
              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {t.tabOverdue} ({overdueCount})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('uptodate')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
            filterTab === 'uptodate'
              ? 'bg-[#24321D] text-white shadow-xs font-bold'
              : 'bg-[#ECE5DC] text-stone-700 hover:bg-[#E2D8CC]'
          }`}
        >
          {t.tabUpToDate} ({Math.max(0, activeCount - overdueCount)})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('completed')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
            filterTab === 'completed'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
          }`}
        >
          {t.tabCompleted} ({completedCount})
        </button>
      </div>

      {/* List of Client Cards / Vignettes */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-stone-800">{t.noClientsFound}</p>
            <p className="text-xs text-stone-500">{t.noClientsDesc}</p>
            <button
              type="button"
              onClick={onOpenNewClient}
              className="py-2 px-4 rounded-xl bg-[#24321D] text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              {t.newClientFileBtn}
            </button>
          </div>
        ) : (
          filteredClients.map((client) => {
            const paidCount = client.installments.filter((i) => i.status === 'paid').length;
            const deferredInsts = client.installments.filter((i) => i.isUnpaidDeferred);
            const overdueInsts = client.installments.filter(
              (i) => i.status === 'overdue' && !i.isUnpaidDeferred
            );
            const isOverdue = overdueInsts.length > 0;
            const payableInstallments = client.installments.filter((i) => !i.isUnpaidDeferred);
            const isCompleted =
              client.status === 'completed' || paidCount === payableInstallments.length;

            const remainingBalance = payableInstallments
              .filter((i) => i.status !== 'paid')
              .reduce((sum, i) => sum + i.amount, 0);

            const nextInst = payableInstallments.find((i) => i.status !== 'paid');

            return (
              <div
                key={client.id}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOverdue
                    ? 'bg-rose-50/80 border-2 border-rose-500 shadow-md ring-1 ring-rose-400'
                    : deferredInsts.length > 0
                    ? 'bg-amber-50/60 border border-amber-300 shadow-xs'
                    : isCompleted
                    ? 'bg-stone-50 border border-stone-200'
                    : 'bg-white border border-stone-200/90 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Clickable Card Top */}
                <div
                  onClick={() => onSelectClient(client)}
                  className="p-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  {/* Top Bar of Vignette */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#ECE5DC] text-[#24321D] flex items-center justify-center shrink-0 border border-stone-300">
                        {getCategoryIcon(client.productCategory)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">
                          {client.fullName}
                        </h3>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <span>{client.productName}</span>
                        </span>
                      </div>
                    </div>

                    {/* DYNAMIC STATUS BADGE (Pulsing RED if Overdue as requested) */}
                    <div className="flex flex-col items-end gap-1">
                      {isOverdue ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white border border-rose-500 flex items-center gap-1 shadow-xs animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-white" />
                          <span>
                            {t.unpaidOverdueRed} (
                            {formatCurrency(
                              overdueInsts[0]?.amount || client.monthlyInstallmentAmount,
                              settings.currency
                            )}
                            )
                          </span>
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white border border-emerald-500 flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{t.completedStatus}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ECE5DC] text-[#24321D] border border-stone-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-600" />
                          <span>{t.statusUpToDate}</span>
                        </span>
                      )}

                      {deferredInsts.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <span>
                            🔄 {deferredInsts.length} {t.deferredCountBadge}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Installments Progress Bar & Summary */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">
                        {t.paidInstallments}
                      </div>
                      <div className="font-bold text-stone-800">
                        {paidCount} / {payableInstallments.length}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">
                        {t.remainingDue}
                      </div>
                      <div
                        className={`font-bold font-mono ${isOverdue ? 'text-rose-700' : 'text-stone-800'}`}
                      >
                        {formatCurrency(remainingBalance, settings.currency)}
                      </div>
                    </div>

                    <div className="text-right rtl:text-left">
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">
                        {t.nextDueDate}
                      </div>
                      <div className="font-medium text-stone-700 text-[11px]">
                        {nextInst
                          ? new Date(nextInst.dueDate).toLocaleDateString(
                              lang === 'ar' ? 'ar-EG' : 'en-US',
                              { day: 'numeric', month: 'short' }
                            )
                          : t.completedStatus}
                      </div>
                    </div>
                  </div>

                  {/* Dot status bar for all months */}
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mt-2.5">
                    {client.installments.map((inst) => {
                      const isInstPaid = inst.status === 'paid';
                      const isInstUnpaidDeferred = inst.isUnpaidDeferred;
                      const isInstExtension = inst.isDeferredExtension;
                      const isInstOverdue = inst.status === 'overdue' && !isInstUnpaidDeferred;
                      return (
                        <div
                          key={inst.id}
                          title={`Traite ${inst.number}: ${
                            isInstPaid
                              ? t.confirmedPaid
                              : isInstUnpaidDeferred
                              ? t.unpaidDeferredRed
                              : isInstExtension
                              ? t.deferredExtensionAmber
                              : isInstOverdue
                              ? t.unpaidOverdueRed
                              : t.pendingDue
                          }`}
                          className={`h-2.5 rounded-full transition-all ${
                            isInstPaid
                              ? 'bg-emerald-600'
                              : isInstUnpaidDeferred
                              ? 'bg-rose-600 ring-2 ring-rose-400'
                              : isInstExtension
                              ? 'bg-amber-500'
                              : isInstOverdue
                              ? 'bg-rose-600 ring-2 ring-rose-300 animate-pulse'
                              : 'bg-stone-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* TWO DIRECT ACTION BUTTONS (NO PHONEBOOK SAVING NEEDED) */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-50 border-t border-stone-200">
                  {/* DIRECT PHONE CALL */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      callPhoneDirect(client.phone);
                    }}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 active:scale-95 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-stone-300 shadow-2xs cursor-pointer"
                    title={`${t.directCallBtn} ${client.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.directCallBtn}</span>
                  </button>

                  {/* DIRECT WHATSAPP */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = generateWhatsAppMessage(
                        client,
                        null,
                        isOverdue ? 'overdue' : 'reminder',
                        settings,
                        lang
                      );
                      openWhatsAppDirect(client.whatsapp || client.phone, msg);
                    }}
                    className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title={t.directWhatsAppBtn}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-black" />
                    <span>{t.directWhatsAppBtn}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
