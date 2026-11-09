import React, { useState, useId } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  CornerDownRight,
  Printer,
  Calendar,
  Send,
  Trash2,
  IdCard,
  MapPin,
  Clock,
  Shield,
  FileText,
  ChevronRight,
  ArrowRightCircle,
  XCircle,
} from 'lucide-react';
import { ClientCredit, Installment, PaymentMethod, AppSettings } from '../types';
import { formatCurrency, openWhatsAppDirect, callPhoneDirect, generateWhatsAppMessage } from '../utils/whatsapp';
import { generateReceiptPdf, generateContractPdf } from '../utils/pdfGenerator';
import { Language, translations } from '../utils/translations';

interface ClientDetailModalProps {
  client: ClientCredit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient: (updated: ClientCredit) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenContractPreview: (client: ClientCredit) => void;
  settings: AppSettings;
  lang: Language;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateClient,
  onDeleteClient,
  onOpenContractPreview,
  settings,
  lang,
}) => {
  const t = translations[lang];
  const modalId = useId();

  // Payment confirmation popup state
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('vodafone_cash');
  const [payReceiptNum, setPayReceiptNum] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  if (!isOpen || !client) return null;

  const paidCount = client.installments.filter((i) => i.status === 'paid').length;
  const overdueCount = client.installments.filter(
    (i) => i.status === 'overdue' && !i.isUnpaidDeferred
  ).length;

  const payableInstallments = client.installments.filter((i) => !i.isUnpaidDeferred);
  const totalRemaining = payableInstallments
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleMarkInstallmentPaid = (installmentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const receiptCode =
      payReceiptNum.trim() || `REC-${Date.now().toString().slice(-6)}`;

    const updatedInstallments = client.installments.map((inst) => {
      if (inst.id === installmentId) {
        return {
          ...inst,
          status: 'paid' as const,
          paidDate: today,
          paymentMethod: payMethod,
          receiptNumber: receiptCode,
        };
      }
      return inst;
    });

    const nonDeferredPayable = updatedInstallments.filter((i) => !i.isUnpaidDeferred);
    const allPaid = nonDeferredPayable.every((i) => i.status === 'paid');

    const updatedClient: ClientCredit = {
      ...client,
      installments: updatedInstallments,
      status: allPaid ? 'completed' : 'active',
    };

    onUpdateClient(updatedClient);
    setMarkingPaidId(null);
    setPayReceiptNum('');
  };

  const handleUnmarkPaid = (installmentId: string) => {
    const today = new Date().toISOString().split('T')[0];

    const updatedInstallments = client.installments.map((inst) => {
      if (inst.id === installmentId) {
        const isPastDue = inst.dueDate < today;
        return {
          ...inst,
          status: (isPastDue ? 'overdue' : 'pending') as 'pending' | 'overdue',
          paidDate: undefined,
          paymentMethod: undefined,
          receiptNumber: undefined,
        };
      }
      return inst;
    });

    const updatedClient: ClientCredit = {
      ...client,
      installments: updatedInstallments,
      status: 'active',
    };

    onUpdateClient(updatedClient);
  };

  const handleMarkOverdue = (installmentId: string) => {
    const updatedInstallments = client.installments.map((inst) => {
      if (inst.id === installmentId) {
        return {
          ...inst,
          status: 'overdue' as const,
          paidDate: undefined,
          paymentMethod: undefined,
          receiptNumber: undefined,
          notes: 'Mois non remboursé / période impayée',
        };
      }
      return inst;
    });

    const updatedClient: ClientCredit = {
      ...client,
      installments: updatedInstallments,
      status: 'active',
    };

    onUpdateClient(updatedClient);
  };

  const handleDeferInstallment = (installmentId: string) => {
    const instToDefer = client.installments.find((i) => i.id === installmentId);
    if (!instToDefer) return;

    const today = new Date().toISOString().split('T')[0];
    const nonExtensionInsts = client.installments.filter((i) => !i.isDeferredExtension);
    const lastStandardDate = nonExtensionInsts.reduce((latest, current) => {
      return current.dueDate > latest ? current.dueDate : latest;
    }, instToDefer.dueDate);

    const existingExtensions = client.installments.filter((i) => i.isDeferredExtension);
    const extensionIndex = existingExtensions.length + 1;

    const baseLastDate = new Date(lastStandardDate);
    const newDueDateObj = new Date(baseLastDate);
    newDueDateObj.setMonth(baseLastDate.getMonth() + extensionIndex);
    const newDueDateStr = newDueDateObj.toISOString().split('T')[0];

    const updatedInstallments: Installment[] = client.installments.map((inst) => {
      if (inst.id === installmentId) {
        return {
          ...inst,
          status: 'overdue' as const,
          isUnpaidDeferred: true,
          originalDueDate: inst.originalDueDate || inst.dueDate,
          deferredToDate: newDueDateStr,
          deferralDate: today,
          notes: `Impayé mois ${inst.number} - reporté à la fin du contrat`,
        };
      }
      return inst;
    });

    const maxNumber = client.installments.reduce((max, i) => Math.max(max, i.number), 0);
    const newExtensionInstallment: Installment = {
      id: `ext-${Date.now()}`,
      number: maxNumber + 1,
      dueDate: newDueDateStr,
      amount: instToDefer.amount,
      status: 'pending',
      isDeferredExtension: true,
      deferredFromMonth: instToDefer.number,
      originalDueDate: instToDefer.dueDate,
      notes: `Report fin pour impayé du mois ${instToDefer.number}`,
    };

    updatedInstallments.push(newExtensionInstallment);

    const updatedClient: ClientCredit = {
      ...client,
      installments: updatedInstallments,
      numberOfMonths: client.numberOfMonths + 1,
    };

    onUpdateClient(updatedClient);
  };

  const handleUndoDefer = (installmentId: string) => {
    const inst = client.installments.find((i) => i.id === installmentId);
    if (!inst) return;

    const linkedExtension = client.installments.find(
      (i) => i.isDeferredExtension && i.deferredFromMonth === inst.number
    );

    const updatedInstallments = client.installments
      .filter((i) => !linkedExtension || i.id !== linkedExtension.id)
      .map((i) => {
        if (i.id === installmentId) {
          return {
            ...i,
            isUnpaidDeferred: false,
            deferredToDate: undefined,
            deferralDate: undefined,
            status: 'overdue' as const,
          };
        }
        return i;
      });

    const updatedClient: ClientCredit = {
      ...client,
      installments: updatedInstallments,
      numberOfMonths: Math.max(1, client.numberOfMonths - 1),
    };

    onUpdateClient(updatedClient);
  };

  const handleSendInstallmentWhatsApp = (inst: Installment) => {
    const isLate = inst.status === 'overdue';
    const msg = generateWhatsAppMessage(client, inst, isLate ? 'overdue' : 'reminder', settings, lang);
    openWhatsAppDirect(client.whatsapp || client.phone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] text-stone-900 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header in Taysir Olive */}
        <div className="bg-[#24321D] text-[#FAF8F5] px-5 py-4 border-b border-[#364735]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C29B38] bg-[#1B2516] px-2.5 py-0.5 rounded-full border border-[#3E5333]">
                {client.contractNumber}
              </span>
              {overdueCount > 0 ? (
                <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-white" />
                  {overdueCount} {t.tabOverdue}
                </span>
              ) : paidCount === client.installments.length ? (
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  {t.completedStatus}
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-[#1B2516] text-stone-200 px-2 py-0.5 rounded-full border border-[#3E5333] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {t.statusUpToDate} ({paidCount}/{client.installments.length})
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-serif font-bold text-[#F4EFEA] mt-2">
            {client.fullName}
          </h2>
          <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
            <span>{client.productName}</span>
            <span>•</span>
            <span className="capitalize">{client.productCategory}</span>
          </p>

          {/* TWO DIRECT ACTION BUTTONS (CALL & WHATSAPP) */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#34472B]">
            <button
              type="button"
              onClick={() => callPhoneDirect(client.phone)}
              className="py-2 px-3 rounded-xl bg-[#1B2516] hover:bg-[#2A3B22] active:scale-95 text-stone-200 font-medium text-xs transition-all flex items-center justify-center gap-2 border border-[#3E5333] cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4 text-stone-300" />
              <span>{t.directCallBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const msg = generateWhatsAppMessage(
                  client,
                  null,
                  overdueCount > 0 ? 'overdue' : 'reminder',
                  settings,
                  lang
                );
                openWhatsAppDirect(client.whatsapp || client.phone, msg);
              }}
              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>{t.directWhatsAppBtn}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Financial summary banner */}
          <div className="grid grid-cols-3 gap-2 bg-[#ECE5DC] p-3 rounded-2xl border border-stone-300/80 text-center shadow-xs">
            <div className="p-1">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">{t.totalSalePriceLabel}</div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                {formatCurrency(client.totalPrice, settings.currency)}
              </div>
              <div className="text-[9px] text-stone-500">
                {t.downPaymentLabel}: {formatCurrency(client.advancePayment, settings.currency)}
              </div>
            </div>

            <div className="p-1 border-x border-stone-300">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">{t.remainingDue}</div>
              <div className={`text-xs sm:text-sm font-bold font-mono ${totalRemaining > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatCurrency(totalRemaining, settings.currency)}
              </div>
              <div className="text-[9px] text-stone-500">
                {paidCount}/{client.installments.length}
              </div>
            </div>

            <div className="p-1">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">{t.myProfitMarginLabel}</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-700 font-mono">
                +{formatCurrency(client.profitMargin, settings.currency)}
              </div>
              <div className="text-[9px] text-stone-500">
                {t.purchaseCostLabel}: {formatCurrency(client.productCostPrice, settings.currency)}
              </div>
            </div>
          </div>

          {/* INSTALLMENTS SECTION (GREEN IF PAID, RED IF OVERDUE) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C29B38]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
                  {t.monthlyInstallmentTracker} ({client.installments.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {client.installments.map((inst) => {
                const isPaid = inst.status === 'paid';
                const isOverdue = inst.status === 'overdue';
                const isUnpaidDeferred = inst.isUnpaidDeferred;
                const isExtension = inst.isDeferredExtension;

                return (
                  <div
                    key={inst.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isPaid
                        ? 'bg-emerald-50/70 border-emerald-300 text-stone-900 shadow-xs'
                        : isUnpaidDeferred
                        ? 'bg-rose-50 border-2 border-rose-500 text-stone-900 shadow-sm'
                        : isExtension
                        ? 'bg-amber-50 border border-amber-300 text-stone-900 shadow-xs'
                        : isOverdue
                        ? 'bg-rose-50 border border-rose-400 text-stone-900 shadow-sm animate-pulse'
                        : 'bg-white border border-stone-200 text-stone-900'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isPaid
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isUnpaidDeferred
                              ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                              : isExtension
                              ? 'bg-amber-500 text-white shadow-xs'
                              : isOverdue
                              ? 'bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-300'
                              : 'bg-[#ECE5DC] text-[#24321D] border border-stone-300'
                          }`}
                        >
                          {inst.number}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-base font-bold text-stone-900 font-mono">
                              {formatCurrency(inst.amount, settings.currency)}
                            </span>

                            {isPaid && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                {t.confirmedPaid} {inst.paidDate ? new Date(inst.paidDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : ''}
                              </span>
                            )}

                            {isUnpaidDeferred && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <AlertTriangle className="w-3 h-3 text-rose-700" />
                                🔴 {t.unpaidDeferredRed}
                              </span>
                            )}

                            {!isUnpaidDeferred && isOverdue && (
                              <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-white" />
                                🔴 {t.unpaidOverdueRed}
                              </span>
                            )}

                            {isExtension && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <CornerDownRight className="w-3 h-3 text-amber-700" />
                                📅 {t.deferredExtensionAmber} ({inst.deferredFromMonth})
                              </span>
                            )}

                            {!isPaid && !isOverdue && !isExtension && !isUnpaidDeferred && (
                              <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                                {t.pendingDue}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-stone-500 mt-1">
                            {isUnpaidDeferred ? (
                              <span className="text-rose-700 font-bold flex flex-wrap items-center gap-1">
                                ⚠️ ({new Date(inst.originalDueDate || inst.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}) &rarr; <span className="underline">{inst.deferredToDate ? new Date(inst.deferredToDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : ''}</span>
                              </span>
                            ) : isExtension ? (
                              <span className="text-amber-800 font-semibold">
                                📌 <strong>{new Date(inst.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> • #{inst.deferredFromMonth}
                              </span>
                            ) : isOverdue ? (
                              <span className="text-rose-700 font-bold flex items-center gap-1">
                                ⚠️ {new Date(inst.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            ) : (
                              <span>
                                {t.dueDateLabel} <strong>{new Date(inst.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                              </span>
                            )}
                            {inst.paymentMethod && (
                              <span className="ml-2 font-bold text-stone-700 capitalize">
                                • {inst.paymentMethod.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right action buttons */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {isPaid ? (
                          /* LORSQUE CONFIRMÉ ENCAISSÉ : BOUTON EXPLICITE "NON CONFIRMÉ" */
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUnmarkPaid(inst.id)}
                              className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 active:scale-95 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-stone-300"
                              title={t.btnNotConfirmed}
                            >
                              <XCircle className="w-4 h-4 text-stone-600" />
                              <span>{t.btnNotConfirmed}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => generateReceiptPdf(client, inst, settings)}
                              className="p-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer border border-stone-300"
                              title={t.btnReceiptPdf}
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{t.btnReceiptPdf}</span>
                            </button>
                          </div>
                        ) : isUnpaidDeferred ? (
                          /* LORSQUE DÉJÀ DÉCALÉE À LA FIN : BOUTON ANNULER LE DÉCALAGE */
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUndoDefer(inst.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1 cursor-pointer border border-stone-300"
                              title={t.btnUndoDefer}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{t.btnUndoDefer}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendInstallmentWhatsApp(inst)}
                              className="p-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                              title="WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                          </div>
                        ) : (
                          /* LORSQUE NON ENCAISSÉ */
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* BOUTON DÉCALER LA TRAITE À LA FIN DE DATE FIN (+1 MOIS) */}
                            {isOverdue && (
                              <button
                                type="button"
                                onClick={() => handleDeferInstallment(inst.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-amber-500"
                                title={t.btnDeferToEnd}
                              >
                                <ArrowRightCircle className="w-3.5 h-3.5" />
                                <span>{t.btnDeferToEnd}</span>
                              </button>
                            )}

                            {/* Bouton relance WhatsApp rapide */}
                            <button
                              type="button"
                              onClick={() => handleSendInstallmentWhatsApp(inst)}
                              className="p-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                              title="WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>

                            {/* Statut Rouge */}
                            {!isOverdue && !isExtension && (
                              <button
                                type="button"
                                onClick={() => handleMarkOverdue(inst.id)}
                                className="px-2 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                                title={t.btnStatusRed}
                              >
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>{t.btnStatusRed}</span>
                              </button>
                            )}

                            {/* Bouton de confirmation au Vert */}
                            <button
                              type="button"
                              onClick={() => setMarkingPaidId(inst.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 bg-[#24321D] hover:bg-[#34472B] text-white"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C29B38]" />
                              <span>{t.btnConfirmPaid}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline Payment Confirmation Form */}
                    {markingPaidId === inst.id && (
                      <div className="mt-3 pt-3 border-t border-stone-200 bg-stone-50 p-2.5 rounded-xl space-y-2 animate-fadeIn border border-stone-200">
                        <div className="text-xs font-semibold text-stone-800">
                          {formatCurrency(inst.amount, settings.currency)} :
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor={`${modalId}-pay-method-${inst.id}`} className="block text-[10px] text-stone-600 mb-0.5">Mode de versement :</label>
                            <select
                              id={`${modalId}-pay-method-${inst.id}`}
                              value={payMethod}
                              onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                              className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-900"
                            >
                              <option value="vodafone_cash">Vodafone Cash</option>
                              <option value="instapay">InstaPay</option>
                              <option value="fawry">Fawry</option>
                              <option value="cash">Espèces (Cash)</option>
                              <option value="orange_cash">Orange Cash</option>
                              <option value="etisalat_cash">Etisalat Cash</option>
                              <option value="paypal">PayPal</option>
                              <option value="bank_transfer">Virement bancaire</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor={`${modalId}-pay-receipt-${inst.id}`} className="block text-[10px] text-stone-600 mb-0.5">N° Reçu / Réf virement :</label>
                            <input
                              id={`${modalId}-pay-receipt-${inst.id}`}
                              type="text"
                              placeholder="Ex: VOD-48910"
                              value={payReceiptNum}
                              onChange={(e) => setPayReceiptNum(e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setMarkingPaidId(null)}
                            className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"
                          >
                            {t.cancel}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkInstallmentPaid(inst.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.btnConfirmPaid}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FICHE TECHNIQUE COMPLETE */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#24321D]">
                <IdCard className="w-4 h-4 text-[#C29B38]" />
                <span>{t.clientInfoSection}</span>
              </div>
              <span className="text-[10px] text-stone-400">100% Local</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">{t.phoneLabel}</span>
                <span className="font-semibold text-stone-800">{client.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">{t.whatsappLabel}</span>
                <span className="font-semibold text-stone-800">{client.whatsapp || client.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">{t.nationalIdLabel}</span>
                <span className="font-semibold text-stone-800">{client.nationalId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">{t.cityLabel}</span>
                <span className="font-semibold text-stone-800">{client.city}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-stone-400 block text-[10px]">{t.addressLabel}</span>
              <div className="font-medium text-stone-700 flex items-start gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>{client.address || 'N/A'}</span>
              </div>
            </div>

            {/* Garant / Caution */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#24321D] mb-1">
                <Shield className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>{t.guarantorSection} :</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{client.guarantorName || 'N/A'}</span>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    {client.guarantorRelation || 'Proche'}
                  </span>
                </div>
                {client.guarantorPhone && (
                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <span>{t.phoneLabel}: {client.guarantorPhone}</span>
                    <button
                      type="button"
                      onClick={() => callPhoneDirect(client.guarantorPhone)}
                      className="text-[#24321D] font-bold underline"
                    >
                      {t.callGuarantor}
                    </button>
                  </div>
                )}
                {client.guarantorAddress && (
                  <div className="text-[10px] text-stone-500">
                    {t.addressLabel}: {client.guarantorAddress}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PDF CONTRACT & ACTIONS */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenContractPreview(client)}
              className="w-full py-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C29B38]" />
              <span>{t.btnViewContractPdf}</span>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </button>

            <button
              type="button"
              onClick={() => generateContractPdf(client, settings)}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-stone-300 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>{t.btnDownloadContractPdf}</span>
            </button>
          </div>

          {/* Delete area */}
          <div className="pt-2 text-center">
            {showConfirmDelete ? (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl space-y-2">
                <p className="text-xs text-rose-900 font-medium">
                  {t.confirmDeletePrompt}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    {t.noKeep}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteClient(client.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    {t.yesDelete}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="text-stone-400 hover:text-rose-600 text-xs flex items-center justify-center gap-1 mx-auto cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.btnDeleteFolder}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
