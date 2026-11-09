import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  Phone,
  MessageSquare,
  ShoppingBag,
} from 'lucide-react';
import { ClientCredit, PurchaseExpense, AppSettings } from '../types';
import { formatCurrency, openWhatsAppDirect, callPhoneDirect, generateWhatsAppMessage } from '../utils/whatsapp';
import { Language, translations } from '../utils/translations';

interface DashboardViewProps {
  clients: ClientCredit[];
  expenses: PurchaseExpense[];
  onOpenNewClient: () => void;
  onSelectClient: (client: ClientCredit) => void;
  onNavigateTab: (tab: 'clients' | 'catalog' | 'contracts' | 'settings') => void;
  settings: AppSettings;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  expenses,
  onOpenNewClient,
  onSelectClient,
  onNavigateTab,
  settings,
  lang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Global Recovery Calculations
  const totalInvested =
    expenses.reduce((sum, exp) => sum + exp.purchasePrice, 0) ||
    clients.reduce((sum, c) => sum + c.productCostPrice, 0);

  const totalCreditGranted = clients.reduce((sum, c) => sum + c.totalPrice, 0);

  const totalAdvancesCollected = clients.reduce((sum, c) => sum + c.advancePayment, 0);
  const totalInstallmentsPaid = clients.reduce(
    (sum, c) =>
      sum +
      c.installments
        .filter((i) => i.status === 'paid')
        .reduce((instSum, inst) => instSum + inst.amount, 0),
    0
  );
  const totalCollected = totalAdvancesCollected + totalInstallmentsPaid;

  const totalRemaining = clients.reduce(
    (sum, c) =>
      sum +
      c.installments
        .filter((i) => i.status !== 'paid' && !i.isUnpaidDeferred)
        .reduce((instSum, inst) => instSum + inst.amount, 0),
    0
  );

  const totalExpectedProfit = clients.reduce((sum, c) => sum + c.profitMargin, 0);

  const recoveryRate =
    totalCreditGranted > 0 ? Math.round((totalCollected / totalCreditGranted) * 100) : 0;

  const overdueClients = clients.filter((c) =>
    c.installments.some((i) => i.status === 'overdue' && !i.isUnpaidDeferred)
  );

  const totalOverdueAmount = overdueClients.reduce((sum, c) => {
    return (
      sum +
      c.installments
        .filter((i) => i.status === 'overdue' && !i.isUnpaidDeferred)
        .reduce((iSum, i) => iSum + i.amount, 0)
    );
  }, 0);

  // Upcoming installments
  const upcomingThisWeek: {
    client: ClientCredit;
    installmentNumber: number;
    amount: number;
    dueDate: string;
  }[] = [];
  clients.forEach((c) => {
    c.installments.forEach((inst) => {
      if (inst.status === 'pending' && !inst.isUnpaidDeferred) {
        upcomingThisWeek.push({
          client: c,
          installmentNumber: inst.number,
          amount: inst.amount,
          dueDate: inst.dueDate,
        });
      }
    });
  });
  upcomingThisWeek.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 text-[#24321D]">
      {/* Welcome Banner */}
      <div className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C29B38]">
          {t.recoveryDashboard}
        </span>
        <h2 className="text-xl font-serif font-bold text-[#24321D] mt-0.5">
          {t.generalInstallmentTracking}
        </h2>
        <p className="text-xs text-stone-500">
          {t.tagline}
        </p>
      </div>

      {/* OVERDUE CRITICAL ALERT BANNER IF ANY (Highlighted in RED as requested) */}
      {overdueClients.length > 0 && (
        <div className="bg-rose-50 text-rose-900 p-4 rounded-3xl border border-rose-300 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-200 text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-700 animate-pulse" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  🔴 {overdueClients.length} {t.overdueAlertTitle}
                </h3>
                <span className="text-[11px] text-rose-700">
                  {t.totalOverdueAmt} <strong className="text-rose-900 font-mono">{formatCurrency(totalOverdueAmount, settings.currency)}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('clients')}
              className="text-[10px] font-bold bg-rose-600 text-white px-3 py-1.5 rounded-xl hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
            >
              {t.viewList} {isRtl ? '←' : '→'}
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {overdueClients.slice(0, 2).map((c) => {
              const overdueInst = c.installments.find(
                (i) => i.status === 'overdue' && !i.isUnpaidDeferred
              );
              return (
                <div
                  key={c.id}
                  className="bg-white p-2.5 rounded-xl flex items-center justify-between text-xs border border-rose-200 shadow-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900">{c.fullName}</span>
                    <span className="text-[10px] text-rose-700 font-bold mx-1.5 font-mono">
                      ({formatCurrency(overdueInst?.amount || c.monthlyInstallmentAmount, settings.currency)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => callPhoneDirect(c.phone)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] cursor-pointer border border-stone-200"
                      title={t.directCallBtn}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateWhatsAppMessage(
                          c,
                          overdueInst || null,
                          'overdue',
                          settings,
                          lang
                        );
                        openWhatsAppDirect(c.whatsapp || c.phone, msg);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3 text-black" />
                      <span>{t.remindWhatsApp}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Hero Card in Taysir Olive & Gold */}
      <div className="bg-[#24321D] text-[#FAF8F5] p-5 rounded-3xl border border-[#3E5333] shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C29B38]">
            {t.recoveryRate}
          </span>
          <span className="text-xs font-bold bg-[#1B2516] px-2.5 py-0.5 rounded-full text-[#F4EFEA] border border-[#3E5333]">
            {recoveryRate}% {t.collectedRate}
          </span>
        </div>

        <div className="relative z-10 mb-4">
          <div className="text-[11px] text-stone-300">{t.totalCollected}</div>
          <div className="text-3xl font-serif font-bold text-[#F4EFEA] tracking-tight drop-shadow-xs">
            {formatCurrency(totalCollected, settings.currency)}
          </div>
          <div className="text-[11px] text-[#C29B38] font-medium mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {t.totalGranted}: {formatCurrency(totalCreditGranted, settings.currency)}
            </span>
          </div>
        </div>

        {/* Progress Bar with Gold Glow */}
        <div className="relative z-10 space-y-1.5">
          <div className="w-full h-3 rounded-full bg-[#1B2516] overflow-hidden p-0.5 border border-[#3E5333]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C29B38] via-amber-400 to-emerald-400 transition-all duration-500 shadow-xs"
              style={{ width: `${Math.min(100, Math.max(5, recoveryRate))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-300">
            <span>{t.collectedRate}: {formatCurrency(totalCollected, settings.currency)}</span>
            <span>{t.totalRemaining}: {formatCurrency(totalRemaining, settings.currency)}</span>
          </div>
        </div>

        {/* Key Metrics Grid inside card */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#34472B] relative z-10 text-xs">
          <div className="bg-[#1B2516] p-2.5 rounded-xl border border-[#3E5333]">
            <span className="text-[10px] text-stone-400 block">{t.capitalInvested}</span>
            <span className="font-bold text-[#FAF8F5] text-sm">
              {formatCurrency(totalInvested, settings.currency)}
            </span>
          </div>
          <div className="bg-[#1B2516] p-2.5 rounded-xl border border-[#3E5333]">
            <span className="text-[10px] text-stone-400 block">{t.expectedProfit}</span>
            <span className="font-bold text-emerald-400 text-sm">
              +{formatCurrency(totalExpectedProfit, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenNewClient}
          className="p-3.5 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 border border-[#3E5333] text-[#FAF8F5] font-bold text-xs transition-all flex items-center justify-between shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#34472B] text-[#C29B38] flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-left rtl:text-right">
              <div className="text-xs font-bold leading-tight">{t.newCreditAction}</div>
              <div className="text-[10px] text-stone-300 font-normal">{t.newCreditDesc}</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#C29B38] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('catalog')}
          className="p-3.5 rounded-2xl bg-white hover:bg-stone-50 active:scale-95 border border-stone-200 text-stone-900 font-bold text-xs transition-all flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ECE5DC] text-[#24321D] flex items-center justify-center border border-stone-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-left rtl:text-right">
              <div className="text-xs font-bold leading-tight">{t.catalogAction}</div>
              <div className="text-[10px] text-stone-500 font-normal">{t.catalogDesc}</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-stone-400 shrink-0" />
        </button>
      </div>

      {/* Upcoming Installments Section */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C29B38]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
              {t.upcomingDueTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('clients')}
            className="text-[11px] font-bold text-[#24321D] hover:underline transition-colors cursor-pointer"
          >
            {t.allClientsLink} {isRtl ? '←' : '→'}
          </button>
        </div>

        <div className="space-y-2">
          {upcomingThisWeek.length === 0 ? (
            <p className="text-xs text-stone-400 py-3 text-center">
              {t.statusUpToDate}
            </p>
          ) : (
            upcomingThisWeek.slice(0, 4).map((item, idx) => (
              <div
                key={`${item.client.id}-${item.installmentNumber}-${idx}`}
                onClick={() => onSelectClient(item.client)}
                className="p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors flex items-center justify-between cursor-pointer border border-stone-200/80"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {item.client.fullName}
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center gap-1.5">
                    <span>{item.client.productName}</span>
                    <span>•</span>
                    <span>
                      {t.dueDateLabel}{' '}
                      {new Date(item.dueDate).toLocaleDateString(
                        lang === 'ar' ? 'ar-EG' : 'en-US',
                        { day: 'numeric', month: 'short' }
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-right rtl:text-left flex items-center gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#24321D] font-mono">
                      {formatCurrency(item.amount, settings.currency)}
                    </div>
                    <div className="text-[9px] text-stone-400 font-semibold">
                      {t.paidInstallments} #{item.installmentNumber}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const inst = item.client.installments.find(
                        (i) => i.number === item.installmentNumber
                      );
                      const msg = generateWhatsAppMessage(
                        item.client,
                        inst || null,
                        'reminder',
                        settings,
                        lang
                      );
                      openWhatsAppDirect(item.client.whatsapp || item.client.phone, msg);
                    }}
                    className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-black shadow-xs cursor-pointer"
                    title={t.directWhatsAppBtn}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
