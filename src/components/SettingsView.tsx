import React, { useState } from 'react';
import {
  KeyRound,
  Download,
  Upload,
  User,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Save,
  Globe,
} from 'lucide-react';
import { AppSettings } from '../types';
import {
  exportDatabaseBackup,
  importDatabaseBackup,
  DEFAULT_SETTINGS,
  INITIAL_CLIENTS,
  INITIAL_EXPENSES,
  INITIAL_PRODUCTS,
  saveClients,
  saveExpenses,
  saveProducts,
} from '../utils/storage';
import { Language, translations } from '../utils/translations';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onRefreshData: () => void;
  lang: Language;
  onToggleLang: (newLang: Language) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onRefreshData,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [pinCurrent, setPinCurrent] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (pinCurrent !== settings.pinCode) {
      setPinError(lang === 'ar' ? 'رمز PIN الحالي غير صحيح.' : 'Current PIN is incorrect.');
      return;
    }
    if (pinNew.length !== 4 || !/^\d{4}$/.test(pinNew)) {
      setPinError(
        lang === 'ar'
          ? 'يجب أن يتكون رمز PIN الجديد من 4 أرقام بالضبط.'
          : 'New PIN must be exactly 4 digits.'
      );
      return;
    }
    if (pinNew !== pinConfirm) {
      setPinError(
        lang === 'ar'
          ? 'تأكيد الرمز غير متطابق مع الرمز الجديد.'
          : 'Confirmation does not match new PIN.'
      );
      return;
    }

    const updated = { ...settings, pinCode: pinNew };
    onUpdateSettings(updated);
    setPinSuccess(true);
    setPinCurrent('');
    setPinNew('');
    setPinConfirm('');
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    exportDatabaseBackup();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseBackup(content);
        if (success) {
          setImportStatus(
            lang === 'ar' ? 'تم استرجاع النسخة الاحتياطية بنجاح !' : 'Backup restored successfully!'
          );
          onRefreshData();
        } else {
          setImportStatus(
            lang === 'ar' ? 'خطأ : ملف النسخة الاحتياطية غير صالح.' : 'Error: invalid backup file.'
          );
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    const confirmMsg =
      lang === 'ar'
        ? 'هل ترغب في استرجاع كافة البيانات التجريبية الافتراضية؟'
        : 'Reset all data to default demo entries?';
    if (window.confirm(confirmMsg)) {
      saveClients(INITIAL_CLIENTS);
      saveExpenses(INITIAL_EXPENSES);
      saveProducts(INITIAL_PRODUCTS);
      onUpdateSettings(DEFAULT_SETTINGS);
      onRefreshData();
      alert(
        lang === 'ar'
          ? 'تم استرجاع البيانات التجريبية بنجاح !'
          : 'Demo data reset successfully!'
      );
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-5 text-[#24321D]">
      {/* Header */}
      <div className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C29B38]">
          {t.settingsTitle}
        </span>
        <h2 className="text-xl font-serif font-bold text-[#24321D]">
          {t.navSettings}
        </h2>
        <p className="text-xs text-[#6B7563]">
          {t.secureOffline} • {t.encryptedData}
        </p>
      </div>

      {/* 0. DUAL LANGUAGE SELECTION (ENGLISH / ARABIC) */}
      <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-[#ECE5DC] pb-2">
          <div className="p-2 rounded-xl bg-[#ECE5DC] text-[#24321D] border border-[#DDD4C7]">
            <Globe className="w-4 h-4 text-[#C29B38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
              {t.languageSelectLabel}
            </h3>
            <p className="text-[11px] text-[#6B7563]">
              {lang === 'ar' ? 'التبديل الفوري بين العربية والإنجليزية' : 'Instant switch between English and Arabic'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggleLang('ar')}
            className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              lang === 'ar'
                ? 'bg-[#24321D] text-[#FAF8F5] border-[#24321D] shadow-sm'
                : 'bg-white text-[#55634D] border-[#DDD4C7] hover:bg-[#F2ECE3]'
            }`}
          >
            <span className="text-sm">🇪🇬</span>
            <span>العربية (AR)</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleLang('en')}
            className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-[#24321D] text-[#FAF8F5] border-[#24321D] shadow-sm'
                : 'bg-white text-[#55634D] border-[#DDD4C7] hover:bg-[#F2ECE3]'
            }`}
          >
            <span className="text-sm">🇬🇧</span>
            <span>English (EN)</span>
          </button>
        </div>
      </div>

      {/* 1. SÉCURITÉ & CODE PIN 4 CHIFFRES */}
      <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-[#ECE5DC] pb-2">
          <div className="p-2 rounded-xl bg-[#ECE5DC] text-[#24321D] border border-[#DDD4C7]">
            <KeyRound className="w-4 h-4 text-[#C29B38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
              {t.securitySectionTitle}
            </h3>
            <p className="text-[11px] text-[#6B7563]">
              {t.encryptedData}
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-2.5 text-xs">
          <div>
            <label className="block text-[#6B7563] font-medium mb-1">
              {t.currentPinLabel}
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pinCurrent}
              onChange={(e) => setPinCurrent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] font-mono tracking-widest text-center focus:outline-none focus:border-[#24321D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                {t.newPinLabel}
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pinNew}
                onChange={(e) => setPinNew(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] font-mono tracking-widest text-center focus:outline-none focus:border-[#24321D]"
              />
            </div>
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                {t.confirmPinLabel}
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] font-mono tracking-widest text-center focus:outline-none focus:border-[#24321D]"
              />
            </div>
          </div>

          {pinError && (
            <p className="text-[11px] text-rose-600 font-medium">{pinError}</p>
          )}

          {pinSuccess && (
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.pinChangedSuccess}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-semibold cursor-pointer shadow-sm transition-all"
          >
            {t.changePinBtn}
          </button>
        </form>
      </div>

      {/* 2. COORDONNÉES DU CRÉANCIER / VENDEUR */}
      <form onSubmit={handleSaveGeneral} className="space-y-4">
        <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-[#ECE5DC] pb-2">
            <div className="p-2 rounded-xl bg-[#ECE5DC] text-[#24321D] border border-[#DDD4C7]">
              <User className="w-4 h-4 text-[#C29B38]" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
                {t.sellerDetailsSection}
              </h3>
              <p className="text-[11px] text-[#6B7563]">
                {lang === 'ar'
                  ? 'تطبع تلقائياً على العقود وإيصالات السداد PDF'
                  : 'Printed automatically on contracts and receipt PDFs'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[#6B7563] font-medium mb-1">
              {t.sellerNameLabel}
            </label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
            />
          </div>

          <div>
            <label className="block text-[#6B7563] font-medium mb-1">
              {t.sellerBusinessLabel}
            </label>
            <input
              type="text"
              value={formData.sellerBusinessName}
              onChange={(e) => setFormData({ ...formData, sellerBusinessName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                {t.phoneLabel}
              </label>
              <input
                type="text"
                value={formData.sellerPhone}
                onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
              />
            </div>
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                {t.nationalIdLabel}
              </label>
              <input
                type="text"
                value={formData.sellerNationalId}
                onChange={(e) => setFormData({ ...formData, sellerNationalId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#6B7563] font-medium mb-1">
              {t.addressLabel}
            </label>
            <input
              type="text"
              value={formData.sellerAddress}
              onChange={(e) => setFormData({ ...formData, sellerAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
            />
          </div>
        </div>

        {/* 3. MODES DE PAIEMENT ÉGYPTIENS */}
        <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-[#ECE5DC] pb-2">
            <div className="p-2 rounded-xl bg-[#ECE5DC] text-[#24321D] border border-[#DDD4C7]">
              <CreditCard className="w-4 h-4 text-[#C29B38]" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
                {t.paymentChannelsSection}
              </h3>
              <p className="text-[11px] text-[#6B7563]">
                {lang === 'ar'
                  ? 'ترسل تلقائياً في رسائل الواتساب للتذكير بالسداد'
                  : 'Included automatically in WhatsApp payment reminders'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                Vodafone Cash :
              </label>
              <input
                type="text"
                value={formData.vodafoneCashNumber}
                onChange={(e) => setFormData({ ...formData, vodafoneCashNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                placeholder="01012345678"
              />
            </div>
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                InstaPay ID :
              </label>
              <input
                type="text"
                value={formData.instapayHandle}
                onChange={(e) => setFormData({ ...formData, instapayHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                placeholder="user@instapay"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                Fawry Code :
              </label>
              <input
                type="text"
                value={formData.fawryServiceNumber}
                onChange={(e) => setFormData({ ...formData, fawryServiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                placeholder="Code 78912"
              />
            </div>
            <div>
              <label className="block text-[#6B7563] font-medium mb-1">
                PayPal :
              </label>
              <input
                type="text"
                value={formData.paypalEmail}
                onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                placeholder="email@paypal.com"
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t.savedSuccessAlert}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#C29B38]" />
          <span>{t.saveSettingsBtn}</span>
        </button>
      </form>

      {/* 4. SAUVEGARDE & RESTAURATION LOCALE JSON */}
      <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-3 text-xs">
        <div className="flex items-center gap-2 border-b border-[#ECE5DC] pb-2">
          <div className="p-2 rounded-xl bg-[#ECE5DC] text-[#24321D] border border-[#DDD4C7]">
            <Download className="w-4 h-4 text-[#C29B38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#24321D]">
              {t.backupSectionTitle}
            </h3>
            <p className="text-[11px] text-[#6B7563]">
              {lang === 'ar'
                ? 'تصدير أو استيراد البيانات بدون إنترنت على أي هاتف'
                : 'Export or import your offline data to another phone'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="py-2.5 px-3 rounded-xl bg-[#ECE5DC] hover:bg-[#E0D7CC] text-[#24321D] font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-[#DDD4C7] transition-all"
          >
            <Download className="w-4 h-4 text-[#24321D]" />
            <span>{t.exportJsonBtn}</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-[#ECE5DC] hover:bg-[#E0D7CC] text-[#24321D] font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center border border-[#DDD4C7] transition-all">
            <Upload className="w-4 h-4 text-[#24321D]" />
            <span>{t.importJsonBtn}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <p className="text-[11px] text-[#24321D] font-medium text-center">
            {importStatus}
          </p>
        )}

        <div className="pt-2 border-t border-[#ECE5DC]">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="w-full py-2 rounded-xl border border-[#DDD4C7] text-[#7A8772] hover:text-[#24321D] hover:bg-[#ECE5DC] text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDemoBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
