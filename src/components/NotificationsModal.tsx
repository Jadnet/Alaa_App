import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { ClientCredit, AppSettings } from '../types';
import { formatCurrency, openWhatsAppDirect, callPhoneDirect, generateWhatsAppMessage } from '../utils/whatsapp';
import { Language, translations } from '../utils/translations';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientCredit[];
  settings: AppSettings;
  onSelectClient: (client: ClientCredit) => void;
  lang?: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  clients,
  settings,
  onSelectClient,
  lang = 'ar',
}) => {
  const t = translations[lang];
  const [pushStatus, setPushStatus] = useState<string>('');

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  // Overdue clients
  const overdueList: { client: ClientCredit; installment: any; daysLate: number }[] = [];
  // Due soon clients (within 5 days)
  const dueSoonList: { client: ClientCredit; installment: any; daysUntil: number }[] = [];

  clients.forEach((c) => {
    c.installments.forEach((inst) => {
      if (inst.status === 'overdue' && !inst.isUnpaidDeferred) {
        const diffMs = new Date(today).getTime() - new Date(inst.dueDate).getTime();
        const daysLate = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        overdueList.push({ client: c, installment: inst, daysLate });
      } else if (inst.status === 'pending' && !inst.isUnpaidDeferred) {
        const diffMs = new Date(inst.dueDate).getTime() - new Date(today).getTime();
        const daysUntil = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 5) {
          dueSoonList.push({ client: c, installment: inst, daysUntil });
        }
      }
    });
  });

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      setPushStatus(lang === 'ar' ? 'الإشعارات غير مدعومة على هذا المتصفح' : 'Notifications not supported on this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushStatus(lang === 'ar' ? 'تم تفعيل التنبيهات بنجاح !' : 'Notifications enabled successfully!');
        if (overdueList.length > 0) {
          new Notification(lang === 'ar' ? 'تيسير - تنبيهات' : 'Taysir - Alerts', {
            body: `${overdueList.length} ${t.overdueAlertTitle}`,
            icon: '/favicon.ico',
          });
        }
      } else {
        setPushStatus(lang === 'ar' ? 'تم رفض إذن الإشعارات' : 'Notification permission was denied');
      }
    } catch (e) {
      setPushStatus(lang === 'ar' ? 'تعذر تشغيل التنبيهات' : 'Could not enable notifications');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] text-[#24321D] w-full max-w-md rounded-3xl shadow-2xl border border-[#DDD4C7] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#24321D] text-[#FAF8F5] px-5 py-4 flex items-center justify-between border-b border-[#34472B]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 text-[#C29B38] border border-white/15">
              <Bell className="w-5 h-5 text-[#C29B38]" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#FAF8F5]">
                {t.notifications}
              </h2>
              <p className="text-[11px] text-[#D0C7B9]">
                {overdueList.length} {t.tabOverdue}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#D0C7B9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Push permission trigger */}
          <div className="bg-[#F4EDE3] p-3 rounded-2xl border border-[#E3D8CB] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#34472B]" />
              <div>
                <span className="font-bold text-[#24321D] block">Notifications Push</span>
                <span className="text-[10px] text-[#6B7563]">
                  {lang === 'ar' ? 'تنبيهات تيسير' : 'Taysir Alerts'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRequestPushPermission}
              className="px-3 py-1 rounded-xl bg-[#24321D] text-[#FAF8F5] text-[10px] font-bold cursor-pointer hover:bg-[#34472B] shadow-xs transition-all"
            >
              Activer
            </button>
          </div>

          {pushStatus && (
            <p className="text-xs text-center text-[#44553B] font-medium -mt-2">
              {pushStatus}
            </p>
          )}

          {/* OVERDUE LIST (PULSING RED ALERT AS REQUESTED) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{t.tabOverdue} ({overdueList.length})</span>
            </div>

            {overdueList.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.statusUpToDate}</span>
              </div>
            ) : (
              overdueList.map(({ client, installment, daysLate }, idx) => (
                <div
                  key={idx}
                  className="bg-rose-50 border-2 border-rose-400 p-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-pulse-slow"
                >
                  <div>
                    <div className="text-xs font-bold text-rose-950">
                      {client.fullName}
                    </div>
                    <div className="text-[11px] text-rose-800 font-bold mt-0.5">
                      {formatCurrency(installment.amount, settings.currency)} • Retard {daysLate} j
                    </div>
                    <div className="text-[10px] text-rose-700/80">
                      Traite #{installment.number} ({client.productName})
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => callPhoneDirect(client.phone)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-100 text-[#24321D] border border-rose-300 cursor-pointer shadow-xs transition-all"
                      title={t.directCallBtn}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#24321D]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateWhatsAppMessage(client, installment, 'overdue', settings, lang);
                        openWhatsAppDirect(client.whatsapp || client.phone, msg);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* UPCOMING THIS WEEK */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#24321D] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#C29B38]" />
              <span>{t.upcomingDueTitle} ({dueSoonList.length})</span>
            </div>

            {dueSoonList.length === 0 ? (
              <p className="text-xs text-[#7A8772] text-center py-2">
                {t.statusUpToDate}
              </p>
            ) : (
              dueSoonList.map(({ client, installment, daysUntil }, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] border border-[#E5DDD0] p-3 rounded-2xl flex items-center justify-between shadow-xs"
                >
                  <div>
                    <div className="text-xs font-bold text-[#24321D]">
                      {client.fullName}
                    </div>
                    <div className="text-[11px] text-[#34472B] font-bold mt-0.5">
                      {formatCurrency(installment.amount, settings.currency)} •{' '}
                      {daysUntil === 0
                        ? "Aujourd'hui !"
                        : daysUntil === 1
                        ? 'Demain'
                        : `Dans ${daysUntil} jours`}
                    </div>
                    <div className="text-[10px] text-[#7A8772]">
                      Traite #{installment.number} ({client.productName})
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateWhatsAppMessage(client, installment, 'reminder', settings, lang);
                        openWhatsAppDirect(client.whatsapp || client.phone, msg);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Rappel</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
