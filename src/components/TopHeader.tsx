import React from 'react';
import { Lock, Bell, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface TopHeaderProps {
  onLock: () => void;
  overdueCount: number;
  dueTodayCount: number;
  onOpenNotifications: () => void;
  isMobileDeviceView: boolean;
  onToggleDeviceView: () => void;
  lang: Language;
  onToggleLang: (newLang: Language) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onLock,
  overdueCount,
  dueTodayCount,
  onOpenNotifications,
  isMobileDeviceView,
  onToggleDeviceView,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const totalAlerts = overdueCount + dueTodayCount;

  return (
    <header className="sticky top-0 z-30 bg-[#24321D] text-[#FAF8F5] border-b border-[#34472B] shadow-md overflow-visible">
      <div className="max-w-md mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left Side: Lock security button + Desktop frame switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onLock}
            className="w-9 h-9 rounded-xl bg-[#1B2516] hover:bg-[#2A3B22] active:scale-95 text-[#FAF8F5] transition-all border border-[#3E5333] flex items-center justify-center cursor-pointer shadow-xs"
            title={t.lockApp}
            aria-label={t.lockApp}
          >
            <Lock className="w-4 h-4 text-[#C29B38]" />
          </button>

          {/* Device view toggle: visible on larger viewports to preview phone shell */}
          <button
            type="button"
            onClick={onToggleDeviceView}
            className="hidden md:flex w-9 h-9 rounded-xl bg-[#1B2516] hover:bg-[#2A3B22] active:scale-95 text-stone-300 transition-all border border-[#3E5333] items-center justify-center cursor-pointer shadow-xs"
            title={isMobileDeviceView ? "Plein écran" : "Vue Téléphone"}
          >
            {isMobileDeviceView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>

        {/* Center: Brand Name (Centered & flexible to never squeeze icons) */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
          <div className="flex items-center justify-center gap-1.5 max-w-full">
            <h1 className="text-sm sm:text-base font-serif tracking-[0.18em] font-bold text-[#F4EFEA] uppercase truncate drop-shadow-xs">
              {lang === 'ar' ? 'تيسير' : 'TAYSIR'}
            </h1>
            <span className="text-xs font-bold text-[#C29B38] font-arabic shrink-0">
              {lang === 'ar' ? 'Taysir' : 'تيسير'}
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] tracking-wider text-stone-300 font-medium truncate max-w-full opacity-90">
            {t.appSubtitle}
          </span>
        </div>

        {/* Right Side: Language Switcher + High-Visibility Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Compact Language Toggle Pill */}
          <div className="flex items-center bg-[#1B2516] p-0.5 rounded-full border border-[#3E5333] shadow-xs">
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#34472B] text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('ar')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                lang === 'ar'
                  ? 'bg-[#34472B] text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              عربي
            </button>
          </div>

          {/* Prominent Notification Bell Button with Glowing Alert Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-[#1B2516] hover:bg-[#2A3B22] active:scale-95 text-[#FAF8F5] transition-all border border-[#3E5333] hover:border-[#C29B38]/60 flex items-center justify-center cursor-pointer shadow-xs shrink-0"
            title={t.notifications}
            aria-label={t.notifications}
          >
            <Bell className="w-4 h-4 text-[#F4EFEA]" />
            {totalAlerts > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center min-w-[18px] h-[18px] shadow-md ring-2 ring-[#24321D] ${
                  overdueCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
                }`}
              >
                {totalAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick overdue notice alert bar if any client has delayed installment */}
      {overdueCount > 0 && (
        <div
          onClick={onOpenNotifications}
          className="bg-rose-900 border-t border-rose-700/80 px-3 sm:px-4 py-1.5 text-xs text-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-800 transition-all shadow-inner"
        >
          <div className="flex items-center gap-1.5 truncate">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300 shrink-0 animate-pulse" />
            <span className="font-medium text-[10.5px] truncate">
              <strong className="text-white">{overdueCount}</strong> {t.overdueTopNotice}
            </span>
          </div>
          <span className="text-[9.5px] underline text-rose-200 font-semibold uppercase tracking-wider shrink-0 ml-1 rtl:mr-1 rtl:ml-0">
            {t.whatsappRemindNow} {isRtl ? '←' : '→'}
          </span>
        </div>
      )}
    </header>
  );
};
